# npm-package-info

A simple command-line tool to query and search for npm packages.

![img.png](img.png)

## Features

- Query npm package information, including:
  - Name
  - Description
  - Version
  - Weekly Downloads
  - Last Publish Date
  - Collaborators
  - Owner (if provided)
  - Tags
- Search for npm packages by keywords

## Installation

1. Clone the repository:

```sh
git clone https://github.com/minmyatoo/npm-package-info.git
```

2. Navigate to the repository folder:
```sh
cd npm-package-info
```

3. Install dependencies:
```sh
npm install
```

4. Run the script:
```sh
npm start
```


## Usage

When running the script, you will be prompted to choose an action: "Search by keywords" or "Query package". 

If you choose "Search by keywords", you will be asked to enter the keywords to search for packages. The script will display a list of package names based on the entered keywords.

If you choose "Query package", you will be prompted to enter the package name, owner (optional), and tag (optional). The script will display detailed information about the package, including name, description, version, weekly downloads, last publish date, collaborators, owner (if provided), and tags.
