This repository is a part of
[MaksimAniskov/aws-ssg-ecommerce](https://github.com/MaksimAniskov/aws-ssg-ecommerce).

Content of the repository was derived from
[jamstack-cms/jamstack-ecommerce](https://github.com/jamstack-cms/jamstack-ecommerce).


# Disclaimer

The software and data available in this repository are provided "as is" without warranty of any kind, either express or implied. Use at your own risk.

# How to use it as a starter for your custom shop implementation

1. Clone the project

```sh
$ git clone https://github.com/MaksimAniskov/aws-ssg-ecommerce-jam.git
```

2. Install the dependencies:

```sh
$ yarn

# or

$ npm install
```

3. Create shop "database" or "install" demo database

Create ```shop``` folder and populate it with the data and product images:
```sh
$ mkdir shop
```
or;
<br/>Clone the demo database into a folder next to the app's one and create a link to it:
```sh
$ cd ..
$ git clone https://github.com/MaksimAniskov/aws-ssg-ecommerce-demoshop.git
$ cd aws-ssg-ecommerce-jam
$ ln -s ../aws-ssg-ecommerce-demoshop shop
```

Use [MaksimAniskov/aws-ssg-ecommerce-demoshop](https://github.com/MaksimAniskov/aws-ssg-ecommerce-demoshop) as the reference on data structure.

4. Create settings.json
```sh
$ cp settings.example.json settings.json
$ vi settings.json
```

5. Build then run the project
<br/>(Build step is necessary to generate optimized images of products)

```sh
$ yarn build
$ yarn develop

# or

$ npm run-script build
$ npm run-script develop

```

# About the project

## Tailwind

This project is styled using Tailwind. To learn more how this works, check out the Tailwind documentation [here](https://tailwindcss.com/docs).

## Components

The main files, components, and images you may want to change / modify are:

__Logo__ - src/images/logo.png   
__Buttons, Nav, Header__ - src/components   
__Form components__ - src/components/formComponents   
__Context (state)__ - src/context/mainContext.js   
__Pages (admin, cart, checkout, index)__ - src/pages   
__Templates (category view, single item view, inventory views)__ - src/templates   

## How it works

As it is set up, inventory and product images are fetched from local files in shop sub-folder.
On AWS the files are to be copied from S3 bucket by CodePipeline.
See [MaksimAniskov/aws-ssg-ecommerce](https://github.com/MaksimAniskov/aws-ssg-ecommerce).