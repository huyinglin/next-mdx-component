import fs from 'fs'
import { useMemo } from 'react'
import matter from 'gray-matter'
import fg from 'fast-glob'
import { bundleMDX } from 'mdx-bundler'
import { getMDXComponent } from 'mdx-bundler/client'
// import { MDXRemote } from 'next-mdx-remote'
// import { serialize } from 'next-mdx-remote/serialize'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import path from 'path'
import pMap from 'p-map';
import CustomLink from '../../components/CustomLink'
import Layout from '../../components/Layout'
import testComponent from '../../components/TestComponent'
import { postFilePaths, POSTS_PATH, DEMOS_PATH } from '../../utils/mdxUtils'

// Custom components/renderers to pass to MDX.
// Since the MDX files aren't loaded by webpack, they have no knowledge of how
// to handle import statements. Instead, you must include components in scope
// here.

export default function PostPage({ code, source, frontMatter, demoSource }) {

  const components = {
    a: CustomLink,
    // It also works with dynamically-imported components, which is especially
    // useful for conditionally loading components for certain routes.
    // See the notes in README.md for more details.
    TestComponent: testComponent(demoSource),
    Head,
  }

  const Component = useMemo(() => getMDXComponent(code), [code])

  return (
    <Layout>
      <header>
        <nav>
          <Link href="/">
            <a>👈 Go back home</a>
          </Link>
        </nav>
      </header>
      <div className="post-header">
        {/* <h1>{frontMatter.title}</h1>
        {frontMatter.description && (
          <p className="description">{frontMatter.description}</p>
        )} */}
      </div>
      <main>
        {/* <MDXRemote {...source} components={components} /> */}
        <Component components={components} />
      </main>

      <style jsx>{`
        .post-header h1 {
          margin-bottom: 0;
        }

        .post-header {
          margin-bottom: 2rem;
        }
        .description {
          opacity: 0.6;
        }
      `}</style>
    </Layout>
  )
}

export const getStaticProps = async ({ params }) => {
  const postFilePath = path.join(POSTS_PATH, `${params.slug}.mdx`)
  const source = fs.readFileSync(postFilePath, 'utf-8')
  console.log('source: ', source);

  const entries = fg.sync(['*.tsx'], { cwd: DEMOS_PATH });

  const mapper = async (value) => {
    console.log('path: ', value);
    const demoPath = path.join(DEMOS_PATH, value)

    return {
      path: value,
      content: fs.readFileSync(demoPath, { encoding: 'utf8' }),
    }
  };

  const demoSource = await pMap(entries, mapper);

  const { content, data } = matter(source)

  // const mdxSource = await serialize(content, {
  //   // Optionally pass remark/rehype plugins
  //   mdxOptions: {
  //     remarkPlugins: [],
  //     rehypePlugins: [],
  //   },
  //   scope: data,
  // })

  const { code, frontmatter } = await bundleMDX({
    source,
    // globals: {
    //   '@alife/jinji-basic': {
    //     varName : "jinjiBasic" ,
    //     namedExports : ["Button"] ,
    //     defaultExport : false
    //   }
    // },
  });


  return {
    props: {
      code,
      // source: mdxSource,
      // frontMatter: data,
      demoSource,
    },
  }
}

export const getStaticPaths = async () => {
  const paths = postFilePaths
    // Remove file extensions for page paths
    .map((path) => path.replace(/\.mdx?$/, ''))
    // Map the path into the static paths object required by Next.js
    .map((slug) => ({ params: { slug } }))

  return {
    paths,
    fallback: false,
  }
}
