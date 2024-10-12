"use client";

import LanguageSelector from "@/components/codeEditor/languageSelector";
import Output from "@/components/codeEditor/Output";
import { getChallengeById } from "@/db/models/challenge";
import { Editor, OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChallengeModel } from "@/db/models/challenge";
import Navbar from "@/components/homeComponents/Navbar";
import Image from "next/image";

export default function Solve() {
  const { id }: { id: string } = useParams();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [value, setValue] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");
  const [challenge, setChallenge] = useState<ChallengeModel>();

  const onMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const buildSnippet = () => {
    if (language === "javascript") {
      const snippet = `function ${challenge?.functionName}(${challenge?.parameters}){\n\t// write code here \n\n}`;

      setValue(snippet);
    }

    if (language === "python") {
      const snippet = `def ${challenge?.functionName}(${challenge?.parameters}):\n\t# write code here`;

      setValue(snippet);
    }
  };

  const onSelect = (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
  };

  const getChallange = async () => {
    const challenge = (await getChallengeById(id)) as ChallengeModel;
    setChallenge(challenge);
  };

  useEffect(() => {
    buildSnippet();
  }, [challenge, language]);

  useEffect(() => {
    getChallange();
  }, []);

  return (
    <>
      {challenge ? (
        <div className="flex flex-col min-h-screen min-w-screen">
          <Navbar />
          <div className="flex min-h-screen min-w-screen">
            {/* Challenge Description Section */}
            <div className="min-h-screen w-1/2 p-8 bg-gray-100">
              <h1 className="text-3xl font-bold mb-4">{challenge?.title}</h1>
              <p className="text-lg mb-6">{challenge?.description}</p>
              <h2 className="text-xl font-semibold mb-2">Test Cases:</h2>
              <div className="space-y-4">
                {challenge?.testCases?.map((testCase, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white shadow rounded-md border border-gray-200"
                  >
                    <p className="font-medium font-title">
                      <span className="text-gray-500 font-title">Input:</span>{" "}
                      {testCase.input}
                    </p>
                    <p className="font-medium font-title">
                      <span className="text-gray-500 font-title ">
                        Expected Output:
                      </span>{" "}
                      {testCase.expectedOutput}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Editor and Output Section */}
            <div className="min-h-screen w-1/2 p-8 bg-gray-50 flex flex-col">
              <LanguageSelector language={language} onSelect={onSelect} />
              <div className="flex-grow mt-4 mb-6">
                <Editor
                  options={{
                    minimap: {
                      enabled: false,
                    },
                  }}
                  height="100%"
                  theme="vs-light"
                  language={language}
                  defaultValue={value}
                  onMount={onMount}
                  value={value}
                  onChange={(newValue) => setValue(newValue || "")}
                />
              </div>
              <Output
                editorRef={editorRef}
                language={language}
                functionName={challenge.functionName}
                challengeId={challenge._id.toString()}
                testCases={challenge.testCases}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <Navbar />
          <div className="flex items-center justify-center min-h-screen flex-col">
            <Image
              src="/loading.svg"
              alt=""
              width={100}
              height={0}
              style={{ height: "auto" }}
            />
            <p className=" font-semibold text-gray-700">
              Loading solver field...
            </p>
          </div>
        </>
      )}
    </>
  );
}
