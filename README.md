# webapp

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Add a new DB query

First, you need to unpack the compressed SQLite database.

```bash
tar -xzvf devsincrypto.sqlite.tar.gz
```

You should see a `devsincrypto.sqlite` file in the root folder. Use your favorite DB client to check out the data.

The `scripts` folder contains scripts that read the SQLite db, and generates static JSONs that will be consumed by the webapp. To run those scripts, run

```bash
yarn generate-json
```
