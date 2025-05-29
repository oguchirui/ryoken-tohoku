import TableOfContents from "./TableOfContents";
import AboutContent from "./AboutContent";

const AboutPage = () => {
  const sections = [
    {
      id: 'introduction',
      title: 'はじめに',
      content: (
        <div>
          <p>
            本サイトは、東北大学旅行研究会の活動内容を記録・閲覧するサイトです。今までの活動の振り返りや今後の活動計画を立てる際の参考としてご活用ください。
          </p>
          <p>
            本サークルのサークル長および副サークル長は、本サイトに日々の活動内容を記録していくようお願いいたしします。
          </p>
          <p>
            また、本サイトをむやみやたらに拡散したり、上記の内容以外の目的で使用したりすることはおやめください。
          </p>
          <p>
            何か不具合等がございましたら、本サイトの管理者 小口までご連絡ください。
          </p>
        </div>
      )
    },
    {
      id: 'howtouse',
      title: '使い方',
      content: (
        <p>
          パスワードを保存するには、まずアカウントを作成してください。その後、ログインしてパスワードを追加できます。
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          非常に多くの改行が入っていますが、これは意図的なものです。実際の使用では、必要に応じて適切な内容に置き換えてください。
        </p>
      )
    },
    {
      id: 'password',
      title: 'パスワードを忘れたときは？',
      content: (
        <p>
          パスワードを忘れた場合は、本サイトの管理者 小口までご連絡ください。
        </p>
      )
    },
  ]

  return (
    <div className="about-page">
      <TableOfContents sections={sections}/>
      <AboutContent sections={sections}/>
    </div>
  );
};

export default AboutPage;
