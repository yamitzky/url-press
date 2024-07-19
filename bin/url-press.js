#!/usr/bin/env node
import { createRequestHandler } from "@remix-run/express"
import express from "express"

const app = express()
app.use(express.static("build/client"))

const build = await import("../build/server/index.js")

app.all("*", createRequestHandler({ build }))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`)
})
