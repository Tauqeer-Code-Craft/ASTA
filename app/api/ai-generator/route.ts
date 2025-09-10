import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const { prompt } = await req.json();

    const generatedCode = `import React from 'react';
import ReactDOM from 'react-dom';

function App() {
  return <h1>Hello from AI code!</h1>;
}

ReactDOM.render(<App />, document.getElementById('root'));
`;
    return NextResponse.json({code: generatedCode}, {status: 200 });

}