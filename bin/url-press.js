#!/usr/bin/env node
import { createRequestHandler } from "@remix-run/express"
import express from "express"
import path from 'path'

const __dirname = new URL(".", import.meta.url).pathname
const buildDir = path.join(__dirname, "..", "build")

const app = express()
app.use(express.static(path.join(buildDir, 'client')))
const build = await import(path.join(buildDir, 'server', 'index.js'))

app.all("*", createRequestHandler({ build }))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`)
})
