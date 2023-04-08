import axios from 'axios';
import inquirer from 'inquirer';
import chalk from 'chalk';
import boxen from 'boxen';

export async function searchNpmPackages(keywords: string): Promise<void> {
  try {
    const response = await axios.get(`https://registry.npmjs.org/-/v1/search?text=${keywords}`);
    const results = response.data.objects;

    if (results.length === 0) {
      console.log(chalk.red('No packages found.'));
      return;
    }

    console.log(chalk.green(`Found ${results.length} package(s):`));
    results.forEach((result: any) => {
      console.log(chalk.blue(result.package.name));
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(chalk.red(`Error searching for packages: ${error.message}`));
    } else {
      console.error(chalk.red('An unknown error occurred while searching for packages.'));
    }
  }
}

export async function queryNpmPackages(packageName: string, owner?: string, tag?: string): Promise<void> {
  try {
    let url = `https://registry.npmjs.org/${packageName}`;

    if (owner) {
      url += `/-/maintainers/${owner}`;
    }

    const response = await axios.get(url);
    const packageData = response.data;

    // Fetch package information
    const name = chalk.green(`Name: ${packageData.name}`);
    const description = chalk.blue(`Description: ${packageData.description}`);
    const downloadsResponse = await axios.get(`https://api.npmjs.org/downloads/point/last-week/${packageName}`);
    const weeklyDownloads = chalk.magenta(`Weekly Downloads: ${downloadsResponse.data.downloads}`);
    const lastPublishDate = new Date(packageData.time.modified);
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const lastPublish = chalk.gray(`Last Publish: ${dateFormatter.format(lastPublishDate)}`);
    const collaborators = chalk.blueBright(`Collaborators: ${packageData.maintainers.map((maintainer: { name: string }) => maintainer.name).join(', ')}`);
    const packageOwner = owner ? chalk.greenBright(`Owner: ${owner}`) : '';
    const tags = chalk.yellowBright(`Tags: ${Object.keys(packageData['dist-tags']).join(', ')}`);

    let version;
    if (tag && packageData['dist-tags'][tag]) {
      version = chalk.yellow(`Version (${tag}): ${packageData['dist-tags'][tag]}`);
    } else {
      version = chalk.yellow(`Version: ${packageData['dist-tags'].latest}`);
    }

    // Display package information
    const output = boxen(`${name}\n${description}\n${version}\n${weeklyDownloads}\n${lastPublish}\n${collaborators}\n${packageOwner}\n${tags}`, {
      padding: 1,
      borderColor: 'cyan',
      margin: 1,
    });

    console.log(output);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(chalk.red(`Error querying package: ${error.message}`));
    } else {
      console.error(chalk.red('An unknown error occurred while querying the package.'));
    }
  }
}

async function main() {
  const questions = [
    {
      type: 'list',
      name: 'action',
      message: 'Choose an action:',
      choices: ['Search by keywords', 'Query package'],
    },
    {
      type: 'input',
      name: 'keywords',
      message: 'Enter keywords:',
      when: (answers: any) => answers.action === 'Search by keywords',
      validate: (input: string) => input ? true : 'Keywords are required.',
    },
    {
      type: 'input',
      name: 'packageName',
      message: 'Package name:',
      when: (answers: any) => answers.action === 'Query package',
      validate: (input: string) => input ? true : 'Package name is required.',
    },
    {
      type: 'input',
      name: 'owner',
      message: 'Package owner (optional):',
      when: (answers: any) => answers.action === 'Query package',
    },
    {
      type: 'input',
      name: 'tag',
      message: 'Package tag (optional):',
      when: (answers: any) => answers.action === 'Query package',
    },

  ];

  const answers = await inquirer.prompt(questions);

  if (answers.action === 'Search by keywords') {
    await searchNpmPackages(answers.keywords);
  } else if (answers.action === 'Query package') {
    const { packageName, owner, tag } = answers;
    await queryNpmPackages(packageName, owner, tag);
  }
}

main();
