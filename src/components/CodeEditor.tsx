"use client";
import { useState } from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import Button from "@mui/material/Button";
import { atomone } from "@uiw/codemirror-theme-atomone";
import { python } from "@codemirror/lang-python";

export const CodeEditor = () => {
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [outputStyle, setOutputStyle] = useState<string>("");

  const handleTestCode = async () => {
    setOutputStyle("white");
    setOutput("Running code...");
    try {
      const response = await fetch("http://localhost:8000/test_code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code }),
      });
      const result = await response.json();
      setOutput(result.output);
      if (result.status === "error") {
        setOutputStyle("red");
      }
    } catch (error) {
      console.error("Error executing code:", error);
      setOutput("Code execution failed");
      setOutputStyle("red");
    }
  };

  const handleSubmitCode = async () => {
    setOutputStyle("white");
    setOutput("Running code...");
    try {
      const response = await fetch("http://localhost:8000/submit_code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code }),
      });
      const result = await response.json();
      setOutput(result.output);
      if (result.status === "error") {
        setOutputStyle("red");
      }
    } catch (error) {
      console.error("Error executing code:", error);
      setOutput("Code execution failed");
      setOutputStyle("red");
    }
  };

  return (
    <>
      <div className="flex flex-row items-center justify-center h-[calc(100vh-110px)] px-8 py-5">
        <div className="flex flex-col bg-[#272C35] rounded-lg w-[95%] h-full mx-5">
          <div className="flex flex-row justify-between items-center border-b-2">
            <div className="justify-left ml-2 rounded-sm text-md text-white my-2">
              <p className="px-2">Python 3</p>
            </div>
            <div className="justify-right px-2">
              <Button
                className="mr-2 rounded-full text-white h-6"
                onClick={handleTestCode}
              >
                Test Code
              </Button>
              <Button
                className="mr-2 rounded-full text-white h-6"
                onClick={handleSubmitCode}
              >
                Submit
              </Button>
            </div>
          </div>
          <ReactCodeMirror
            value={code}
            height="300px"
            theme={atomone}
            extensions={[python()]}
            onChange={(value) => setCode(value)}
          />
          <div className="flex flex-col text-white text-md border-t-2 inset-x-0 bottom-0">
            <div className="justify-left ml-2 rounded-sm text-md text-white my-2 bottom-0">
              <p className="px-2">Outputs</p>
            </div>
            <div
              className="mx-2 p-2 rounded-lg overflow-y-auto text-sm bottom-0 display-linebreak"
              style={{ maxHeight: "200px", color: outputStyle }}
            >
              {output}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
