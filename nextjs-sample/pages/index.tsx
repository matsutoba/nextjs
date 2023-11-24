import React from 'react';
import { Client } from '@notionhq/client';
import { GetStaticProps , NextPage} from 'next';
import { Post } from '@/types';

const notion = new Client({
  auth: process.env.NOTION_TOKEN
})

type StaticProps = {
  post: Post | null;
}

export const getStaticProps: GetStaticProps<StaticProps> = async () => {
  const database = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID || '',
    filter: {
      and: [
        {
          property: 'Published',
          checkbox: {
            equals: true
          },
        }
      ],
      sorts: [
        {
          timestamp: 'created_time',
          direction: 'descending'
        }
      ],
    }
  });

  const page = database.results[0];
  if (!page) {
    return {
      props: {
        post: null
      }
    }
  }

  //console.dir(page, { depth: null });


  const blocks = await notion.blocks.children.list({
    block_id: database.results[0]?.id
  })
  //console.dir(blocks, { depth: null });


  const title = page.properties['Name'].title[0]?.plain_text ?? 'N1';
  const slug = page.properties['Slug'].rich_text[0]?.plain_text ?? 'N2';

  
  console.log(title, '|', slug, '|')


  return {
    props: {
      post: {
        id: "1",
        title,
        slug,
        createdTs: null,
        lastEditedTs: null,
        contents:[]
      }
    }
  };
};

const Home: NextPage<StaticProps> = ({post}) => {
  console.log("P", post)
  return <div>{post.title}</div>
}

export default Home;