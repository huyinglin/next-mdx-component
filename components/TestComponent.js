import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/vsLight";
import Demo from '../demos/button';

// const Demo = await import('../demos/button');

function TestComponent({ name = 'world', src, demoSource }) {
  console.log('src: ', src);
  console.log('----demoSource: ', demoSource);
  return (
    <>
      <div>Hello, {name}!</div>
      <Demo/>
      <div style={{ border: '1px solid red', padding: 20 }}>
        <Highlight {...defaultProps} code={demoSource[0]?.content} theme={theme} language="jsx">
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={style}>
              {tokens.map((line, i) => (
                <div {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
      <style jsx>{``}</style>
    </>
  )
}

export default function test(demoSource) {
  return (props) => <TestComponent {...props} demoSource={demoSource}/>
}