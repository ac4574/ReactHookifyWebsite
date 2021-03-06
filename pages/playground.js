import React, { useState } from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'
import { JSHINT } from 'jshint'
import Button from '@material-ui/core/Button'
import copy from 'copy-to-clipboard'
import { testClass, hookifyApp } from '../componentUtils'
import FlexSnackbar from '../components/flexSnackbar'
import Head from 'next/head'

let modeLoaded = false
if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
  require('codemirror/mode/jsx/jsx')
  require('codemirror/addon/edit/matchbrackets')
  require('codemirror/addon/edit/closebrackets')
  require('codemirror/addon/lint/lint')
  require('codemirror/addon/lint/javascript-lint')
  window.JSHINT = JSHINT
  modeLoaded = true
}

export default function Playground() {
  const [inputCode, setInputCode] = useState(testClass)
  const [outputCode, setOutputCode] = useState('')
  const [SnackOpen, setOpen] = useState(false)
  const [error, setError] = useState(
    '// Please enter valid a React class component!'
  )

  function reactClassCompTest(string) {
    let test1 = /(class)(.|\n)*?(extends)(.|\n)*?(Component)/.test(string)
    let test2 = /([^a-zA-z0-9_])(render\()/.test(string)
    if (test1 && test2) {
      return true
    } else {
      return false
    }
  }

  function handleSubmit() {
    try {
      if (reactClassCompTest(inputCode)) {
        setOutputCode(hookifyApp(inputCode))
      } else {
        setOutputCode(error)
      }
    } catch (err) {
      setOutputCode(err.message)
    }
  }

  function handleClear() {
    setInputCode('')
  }

  let options = {
    lineNumbers: true,
    theme: 'material',
    smartIndent: true,
    readOnly: false,
  }
  let options2 = {
    lineNumbers: true,
    theme: 'material',
    smartIndent: true,
    readOnly: true,
  }
  if (modeLoaded) {
    options.mode = 'jsx'
    options2.mode = 'jsx'
    options.matchBrackets = true
    options.autoCloseBrackets = true
    // options.gutters = ['CodeMirror-lint-markers']
    // options.lint = true
  }

  return (
    modeLoaded && (
      <>
        <Head>
          <title>Demo | React Hookify</title>
        </Head>
        <div className="container-0">
          <div className="container-1">
            <div className="container-1a">
              <p className="playground-header">Class Component</p>
              <CodeMirror
                value={inputCode}
                options={options}
                onBeforeChange={(editor, data, value) => {
                  setInputCode(value)
                }}
                onChange={(editor, data, value) => {
                  setInputCode(value)
                }}
              />
              <div className="button-container-1">
                <div className="button-container-1a">
                  <Button
                    variant="contained"
                    color="default"
                    size="small"
                    onClick={() => {
                      copy(inputCode)
                      setOpen(true)
                    }}
                  >
                    Copy
                  </Button>
                  <Button
                    variant="contained"
                    color="default"
                    size="small"
                    id="button-clear"
                    onClick={handleClear}
                  >
                    Clear
                  </Button>
                </div>
                <Button
                  classes={{ label: 'hookify' }}
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleSubmit}
                >
                  Hookify
                </Button>
              </div>
            </div>
            <div className="container-1b">
              <p className="playground-header">Hookfied Functional Component</p>
              <CodeMirror value={outputCode} options={options2} />
              <div className="button-container-2">
                <Button
                  variant="contained"
                  color="default"
                  size="small"
                  onClick={() => {
                    copy(outputCode)
                    setOpen(true)
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </div>
        <FlexSnackbar
          setOpen={setOpen}
          snackState={SnackOpen}
          severity="success"
          message="Copied to clipboard"
        />
      </>
    )
  )
}
