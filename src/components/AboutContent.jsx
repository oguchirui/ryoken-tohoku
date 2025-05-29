

const AboutContent = ({ sections }) => {
  return (
    <div className="about-content">
      {sections.map((section) => (
        <section id={section.id} key={section.id}>
          <h2>{section.title}</h2>
          {section.id === 'introduction' && (
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
          )}
          {section.id === 'howtouse' && (
            <p>
              パスワードを保存するには、まずアカウントを作成してください。その後、ログインしてパスワードを追加できます。
            </p>
          )}
          {section.id === 'password' && (
            <p>
              パスワードを忘れた場合は、本サイトの管理者 小口までご連絡ください。
            </p>
          )}
        </section>
      ))}
    </div>
  );
};

export default AboutContent;
