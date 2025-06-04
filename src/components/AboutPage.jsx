import TableOfContents from "./TableOfContents";
import AboutSections from "./AboutSections";

const AboutPage = () => {
  const sections = [
    {
      id: '1',
      title: 'はじめに',
      content: (
        <div>
          <p>
            本サイトは、東北大学旅行研究会の活動内容を記録・閲覧するサイトです。今までの活動の振り返りや今後の活動計画を立てる際の参考としてご活用ください。<br />
            本サークルのサークル長および副サークル長は、本サイトに日々の活動内容を記録していくようお願いいたしします。<br />
            また、本サイトをむやみに拡散したり、上記の内容以外の目的で使用したりすることはおやめください。<br />
            何か不具合等がございましたら、本サイトの管理者 小口までご連絡ください。
          </p>
        </div>
      ),
    },
    {
      id: '2',
      title: '使い方',
      content: (
        <p>
          本サイトの使い方を説明します。本サイトには、活動記録の閲覧、作成、編集、削除の4つ機能があります。
        </p>
      ),
      children: [
        {
          id: '2-1',
          title: '記録の閲覧',
          content: (
            <div>
              <p>
                ホームページでは、ページ中央に表示されている地図上のピンを選択することで活動記録を閲覧できます。ピンに表示されている数字は、これまでの活動でその場所に行った回数を表しています。
              </p>
              <img className="about-img" src="/howtoview/overview.png" alt="overview" />
              <p>
                活動場所、活動日、活動内容が活動記録として表示されます。これまでに複数回その場所へ行ったことがある場合、日付の新しい順に活動記録が表示されます。活動場所横に表示されている「くの字」ボタンを選択すると、活動記録を閉じることができます。
              </p>
              <img className="about-img" src="/howtoview/showcontents.png" alt="showcontents" />
              <p>
                「場所を検索」と表示されている検索バーに場所を入力することで、その場所を地図上に表示できます。
              </p>
              <img className="about-img" src="/howtoview/placepicker.png" alt="placepicer" />
              <p>
                ピンの表示条件を変更することもできます。例えば、指定した年や都道府県の活動場所のみを表示させたり、指定した回数行ったことがある活動場所のみを表示させたりすることができます。
              </p>
              <img className="about-img" src="/howtoview/searchfilter.png" alt="searchfilter" />
            </div>
            
          ),
        },
        {
          id: '2-2',
          title: '記録の作成',
          content: (
            <div>
              <p>
                ホームページ下部の「新しく活動を記録する」ボタンを選択すると、活動記録作成ページに移動します。
              </p>
              <img className="about-img" src="/howtorecord/torecordpage.png" alt="torecordpage" />
              <p>
                活動記録の作成する際には、活動日、活動場所名、活動内容を入力してください。活動場所名は、以前行ったことがある場所の場合、地図上のオレンジ色のピンを選択することで自動的に入力されます。
              </p>
              <img className="about-img" src="/howtorecord/recordinput.png" alt="recordinput" />
              <p>
                活動場所は、地図上にピンを立てることで選択してください。ホームページと同様に、「場所を検索」と表示されている検索バーに場所を入力することで、その場所を地図上に表示できます。以前行ったことがある場所の場合、地図上のオレンジ色のピンを選択してください。
              </p>
              <img className="about-img" src="/howtorecord/recordmap.png" alt="recordmap" />
              <p>
                すべての項目を入力、選択したら、ページ下部の「記録する」ボタンを選択してください。
              </p>
              <img className="about-img" src="/howtorecord/recordbutton.png" alt="recordbutton" />
              <p>
                正しいパスワードを入力すると、活動記録が作成されます。
              </p>
              <img className="about-img" src="/howtorecord/recordpassword.png" alt="recordpassword" />
            </div>
          ),
        },
        {
          id: '2-3',
          title: '記録の編集',
          content: (
            <div>
              <p>
                ホームページの活動記録表示欄の「<strong>︙</strong>」ボタンを選択し、「編集」ボタンを選択すると、活動記録編集ページに移動します。
              </p>
              <img className="about-img" src="/howtoedit/toeditpage.png" alt="toeditpage" />
              <p>
                活動記録作成ページで入力、選択した項目が表示されます。活動記録を編集する際には、編集したい項目を変更してください。すべての項目を入力、選択したら、ページ下部の「更新する」ボタンを選択してください。
              </p>
              <img className="about-img" src="/howtoedit/editbutton.png" alt="editbutton" />
              <p>
                正しいパスワードを入力すると、活動記録が更新されます。
              </p>
              <img className="about-img" src="/howtoedit/editpassword.png" alt="editpassword" />
            </div>
          ),
        },
        {
          id: '2-4',
          title: '記録の削除',
          content: (
            <div>
              <p>
                ホームページの活動記録表示欄の「<strong>︙</strong>」ボタンを選択し、「削除」ボタンを選択すると、パスワード入力画面が表示されます。
              </p>
              <img className="about-img" src="/howtodelete/deletebutton.png" alt="deletebutton" />
              <p>
                正しいパスワードを入力すると、活動記録が削除されます。削除した活動記録は復元できないので、注意してください。
              </p>
              <img className="about-img" src="/howtodelete/deletepassword.png" alt="deletepassword" />
            </div>
          ),
        },
      ]
    },
    {
      id: '3',
      title: 'パスワード',
      content: (
        <div>
          <p>
            本サイトにはパスワードが存在し、パスワードを用いることで、活動記録の作成、編集、削除を行うことができます。<br />
            通常、パスワードは本サークルのサークル長および副サークル長のみが知ることができます。
          </p>
        </div>
      ),
      children: [
        {
          id: '3-1',
          title: 'パスワードの再設定',
          content: (
            <div>
              <p>
                本サイトにはパスワードを再設定する機能があります。サークル長および副サークル長が代替わりする際には、パスワードを再設定してください。<br />
                本サイト上部に表示されている「パスワードの再設定」ボタンを選択し、現在のパスワードを入力してください。
              </p>
              <img className="about-img" src="/changepassword/changebutton.png" alt="changebutton" />
              <p>
                正しいパスワードを入力すると、新しいパスワードを入力する画面が表示されます。新しいパスワードを入力し、確認のため、新しいパスワードを再入力してください。
              </p>
              <img className="about-img" src="/changepassword/newpassword.png" alt="newpassword" />
              <p>
                新しいパスワードが確認されると、パスワードが再設定されます。
              </p>
              <img className="about-img" src="/changepassword/changed.png" alt="changed" />
            </div>
            
          ),
        },
        {
          id: '3-2',
          title: 'パスワードを忘れたときは？',
          content: (
            <p>
              パスワードを忘れたときは、本サイトの管理者 小口までご連絡ください。
            </p>
          ),
        },
      ]
    },
  ]

  return (
    <div className="about-page">
      <TableOfContents sections={sections} />
      <AboutSections sections={sections} />
    </div>
  );
};

export default AboutPage;
