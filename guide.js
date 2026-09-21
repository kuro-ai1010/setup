'use strict';
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link = (url,text) => `<a href="${url}" target="_blank" rel="noopener">${text} ↗</a>`;
const src = (url,text='公式の説明') => `<p class="source-line">出典：${link(url,text)}</p>`;
const code = (value,where='PCのターミナルで実行') => `<div class="codebox"><div class="codebar"><span>${where}</span><button type="button" class="copy">コピー</button></div><pre><code>${esc(value)}</code></pre></div>`;
const note = (text,blue=false) => `<div class="note${blue?' blue':''}">${text}</div>`;
const ol = (items) => `<ol>${items.map(x=>`<li>${x}</li>`).join('')}</ol>`;
const pic = (file,alt,caption,type='操作イメージ',annotations='')=>`<figure class="visual"><div class="annotated"><button class="zoom" type="button" aria-label="画像を拡大：${esc(alt)}"><img src="assets/${file}.webp" alt="${esc(alt)}" loading="lazy" width="${['download','git-windows','git-mac','code-docs'].includes(file)?1348:1536}" height="${['download','git-windows','git-mac','code-docs'].includes(file)?926:1024}"></button>${annotations}</div><figcaption><b>${type}</b>${caption}　<span>クリックで拡大</span></figcaption></figure>`;
const ann = (x,y,w,h,label)=>`<div class="annotation" style="left:${x}%;top:${y}%;width:${w}%;height:${h}%"><span>${label}</span></div>`;
const step=(n,title,where,body,done)=>`<article class="step"><div class="step-top"><span class="step-num">${n}</span><div><h3>${title}</h3><span class="where">${where}</span></div></div>${body}${done?`<div class="done"><strong>✓ 次へ進める目印</strong>${done}</div>`:''}</article>`;
const chapter=(id,n,title,intro,body)=>`<section class="chapter" id="${id}"><div class="chapter-head"><div class="chapter-number">CHAPTER ${n}</div><h2>${title}</h2><p>${intro}</p></div>${body}</section>`;
const detail=(title,body)=>`<details><summary>${title}</summary><div class="detail-content">${body}</div></details>`;
const table=(headers,rows)=>`<div class="table-wrap"><table><thead><tr>${headers.map(x=>`<th scope="col">${x}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const docs='https://code.claude.com/docs/en/';
let os='windows';
function render(){
const mac=os==='mac';const pc=mac?'Mac':'Windows';const terminal=mac?'ターミナル':'PowerShell';const paste=mac?'⌘ Command + V':'Ctrl + V';
$('#requirements').innerHTML=`<h3>先に確認するもの</h3>${table(['準備するもの','必要？','このガイドでの扱い'],[
[`${pc}本体・インターネット`,'必須',mac?'CLIはmacOS 13.0以降・メモリ4GB以上。アプリは別の動作要件を公式ダウンロード先で確認。':'CLIはWindows 10 1809以降・メモリ4GB以上。Windows 11も対象。アプリは別の動作要件を公式ダウンロード先で確認。'],
['Claudeアカウント','必須','アプリ・CLIとも自分のアカウントでログイン。CodeはPro / Max / Team / Enterpriseなどの対応契約が必要。'],
['Git',mac?'推奨':'推奨','ファイルの変更履歴を残す道具。WindowsではGit Bashも入ります。02で導入します。'],
['Node.js / npm','通常は不要','公式のネイティブインストールでは不要。後から作るアプリや、npxを使うMCPサーバーに必要な場合だけ追加。'],
['Homebrew / WSL / Docker','今回の経路では不要','初心者向けに、OS標準のターミナルと公式インストーラーで進めます。'],
['VS Code / GitHubアカウント','任意','Codeの初回起動には不要。編集画面やオンラインでの保存・共同作業が必要になってから追加できます。']
])}${note('<b>アプリの無料チャットと、Claude Codeの利用条件は別です。</b>ダウンロード自体ができても、Codeには対応契約が必要です。CLIではConsoleのAPI課金も選べますが、Claudeの月額プランとは別会計。ここではClaudeの契約でログインする経路を使います。')}${src(docs+'setup','対応環境と利用条件')}${detail('自分のOS・CPUの種類を確認する',mac?ol(['画面左上のAppleメニュー（）をクリックし、「このMacについて」を開きます。','macOSのバージョンと「チップ」または「プロセッサ」を確認します。','Apple MシリーズでもIntelでも、ClaudeのMac用は共通のUniversal版を使えます。']):ol(['「スタート」→「設定」→「システム」→「バージョン情報」を開きます。','「システムの種類」を見ます。「x64 ベース プロセッサ」なら通常のWindows版、「ARM ベース プロセッサ」ならWindows（arm 64）版を選びます。','「Windowsの仕様」でバージョンも確認します。会社のPCでインストール制限がある場合は管理者に相談します。']))}`;
let download=step('1','公式ページで、自分のOSを選ぶ','ブラウザ → Claude公式ダウンロード',
`<p>${link('https://claude.com/download','Claudeの公式ダウンロードページ')}を開きます。広告や非公式の配布サイトを経由せず、このページから入手します。</p>${ol(['「Desktop」の欄までスクロールします。',mac?'「macOS」の右側にある「Download」をクリックします。':'通常は「Windows」の右側の「Download」をクリックします。ARMのPCなら、下の「Windows (arm 64)」を選びます。','ダウンロードが終わるまで待ちます。ブラウザ右上のダウンロード一覧、またはPCの「ダウンロード」フォルダからファイルを開けます。'])}${pic('download','公式Claudeダウンロード画面。macOS、Windows、Windows arm64のボタン','2026年9月21日に撮影。オレンジ枠が選択するOSのボタンです。','実画面キャプチャ',ann(53.4,mac?21.1:28.5,8.3,4.6,mac?'ここを押す：Mac':'ここを押す：Windows'))}`,
'自分のOS用のインストールファイルが「ダウンロード」にあります。');
download+=step('2','Claudeアプリをインストールする',mac?'Finder → ダウンロード → アプリケーション':'エクスプローラー → ダウンロード → スタート',mac?
ol(['DockのFinder（顔のアイコン）をクリックし、左の「ダウンロード」を開きます。','ダウンロードしたClaudeの <code>.dmg</code> ファイルをダブルクリックします。','ClaudeとApplications（アプリケーション）が並ぶ画面なら、ClaudeアイコンをApplicationsへドラッグします。別の案内が表示されたら、そのインストーラーの手順に従います。','コピー完了後、Finderの「アプリケーション」からClaudeをダブルクリックします。','初回の「開いてもよろしいですか？」では、公式から入手したClaudeであることを確認して「開く」を押します。']):
ol(['タスクバーのフォルダアイコンをクリックし、「ダウンロード」を開きます。','公式からダウンロードしたClaudeのセットアップファイルをダブルクリックします。拡張子やファイル名は配布版によって変わることがあります。','インストールの案内が出たら、提供元を確認して「インストール」など表示されたボタンで進めます。自動で進む場合は完了まで待ちます。','終了後、スタートメニューの検索欄に「Claude」と入力し、Claudeアプリを開きます。'])+note('会社・学校の端末で禁止されている場合や、提供元を確認できない警告が出る場合は、そのまま回避せず管理者または公式サポートに確認します。'),
'Claudeのログイン画面が開きます。');
download+=step('3','ログインして、最初の会話を試す','Claudeアプリ → ログイン → チャット',ol(['「Log in」「Sign in」などのログインボタンを押します。ブラウザが開いた場合は、普段使うClaudeアカウントでログインします。','画面に表示される方法で認証します。メール認証なら受信したメールを確認してください。契約がある人は、その契約と同じアカウントを選びます。','「Claudeを開く」など、アプリに戻る案内が出たら戻ります。認証コードを求められた場合は元の認証画面だけに入力します。','チャットの入力欄に「こんにちは。日本語で使い方を3つ教えて」と入力し、送信ボタンを押します。'])+note('ブラウザでClaudeを使うだけなら、アプリのインストールも不要です。アプリとブラウザは同じアカウントで使えます。',true),
'日本語の返答が表示されます。');
download+=step('4','アプリの「Code」を使う場合','Claudeアプリ → Code → Local → Select folder',ol(['Finder／エクスプローラーで、自分のホームフォルダ内に <code>claude-practice</code> という練習用フォルダを作ります。','Claudeアプリで「Code」を開きます。公式ガイドでは上部中央のタブとして案内されています。アプリ更新で配置が変わることがあります。','環境を「Local」にし、「Select folder」で作成した <code>claude-practice</code> を選びます。','送信ボタンの近くの権限モードを確認します。最初は「Manual」が選べる場合、それを選ぶと変更のたびに内容を確認できます。','「このフォルダで何ができますか。まだファイルは変更せず、日本語で教えて」と入力します。'])+note('<b>アプリのCodeは、ここから使えます。</b>ターミナル版を使わない場合は03を飛ばし、04の練習と05の連携へ進めます。Gitを求める案内が出たら02へ進んでください。')+pic('first-session','CodeタブでLocalと作業フォルダを選ぶ操作イメージ','アプリの配置・認証画面は模式図です。下段の日本語依頼は、起動後のClaude Codeの入力欄に送ります。画像の%は入力しません。'),
'Codeの会話画面に、自分で選んだフォルダが表示されます。');
download+=src(docs+'desktop-quickstart','アプリ版Claude Codeの公式導入ガイド');
let git=`<p>Gitは「制作のセーブ履歴」を残す道具です。GitHubというWebサービスとは別物。インストールだけならGitHubへの登録は不要です。</p>`;
git+=step('1',`${terminal}を開き、Gitがあるか確かめる`,`${pc}標準の${terminal}`,
(mac?ol(['キーボードの <kbd>⌘ Command + Space</kbd> を同時に押し、Spotlightを開きます。','「Terminal」または「ターミナル」と入力し、Returnキーを押します。','点滅するカーソルがある入力行に、下のコマンドを貼り付け、Returnを押します。']):ol(['Windowsキーを押し、検索欄に「PowerShell」と入力します。','「Windows PowerShell」を通常の「開く」で起動します。Claude Codeのために「管理者として実行」は必要ありません。','入力行の先頭に <code>PS C:\\Users\\…&gt;</code> とあることを確認します。下のコマンドを貼り付け、Enterを押します。']))+code('git --version',`${terminal}に貼り付け → Enter`)+note('<code>git version 2.xx.x</code> のような表示が出たら、Gitは入っています。次のインストール手順を飛ばし、03へ進んで構いません。表示される番号はその時の版で異なります。',true),
'Gitが入っているか、追加が必要か判断できました。');
git+=mac?step('2','AppleのCommand Line ToolsでGitを入れる','ターミナル → Appleのインストールダイアログ',
`<p>${link('https://git-scm.com/install/mac','Git公式のMac用ページ')}にも案内されている、Apple提供の方法を使います。Homebrewを先に入れる必要はありません。</p>`+code('xcode-select --install','ターミナルに貼り付け → Return')+ol(['インストールの案内が出たら「インストール」を押します。','使用許諾を読み、同意する場合に進めます。ダウンロードとインストールの完了を待ちます。','終わったらターミナルで、もう一度 <code>git --version</code> を実行します。','「already installed」のような表示なら、すでに導入済みです。Gitのバージョン確認へ進みます。'])+note('フルサイズのXcodeアプリをApp Storeから入れる必要はありません。この方法では、Gitを含むコマンドライン用の道具を入れます。')+pic('git-mac','Git公式MacページのXcode Command Line Tools欄','Git公式にあるXcode Command Line Toolsの案内を確認します。','実画面キャプチャ',ann(34.7,56.1,46.5,10,'この方法を使う')),
'<code>git version …</code> が表示されます。'):
step('2','Git for Windowsを公式から入れる','ブラウザ → Git公式 → セットアップ',
`<p>${link('https://git-scm.com/install/windows','Git公式のWindows用ページ')}を開きます。</p>`+pic('git-windows','Git公式Windowsページ。Standalone Installerのx64 Setupを選択','通常のWindows PCはx64 Setup。ARMのPCではその下のARM64 Setupを選びます。Portable版はこの手順では使いません。','実画面キャプチャ',ann(34.8,36.8,19.8,3.4,'x64版はこちら'))+ol(['「Git for Windows/x64 Setup」をクリックします。ARMのPCなら「ARM64 Setup」を選びます。','ダウンロードしたGitの <code>.exe</code> を開きます。Windowsの確認では、公式から入手したGitであることを確認して進めます。','ライセンス表示と保存先を確認します。通常は既定のまま「Next」で進めます。','エディター選択の画面も、特に指定がなければ既定のまま進められます。','「Adjusting your PATH environment」では、推奨の「Git from the command line and also from 3rd-party software」が選ばれていることを確認します。','残りも通常は既定のまま「Next」→「Install」→「Finish」と進めます。','開いていたPowerShellを閉じ、スタートから新しく開きます。<code>git --version</code> を実行します。'])+pic('windows-guide','PowerShellの起動、GitのPATH設定、Claudeインストーラーの操作イメージ','3つの操作箇所を示した補助図です。番号は図中の説明番号で、インストール全体の実行順ではありません。バージョン表示やインストールボタンは実物と異なります。'),
'<code>git version …windows…</code> など、Gitのバージョンが表示されます。');
git+=src(mac?'https://git-scm.com/install/mac':'https://git-scm.com/install/windows','Git公式のインストール方法');
git+=detail('Gitの名前・メール設定は今すぐ必要？',`<p>インストールやClaudeの初回起動だけなら不要です。後で変更履歴を「コミット」として保存するときに使います。以下は入力例なので、自分の情報に置き換えてください。</p>${code('git config --global user.name "Your Name"\ngit config --global user.email "you@example.com"')}<p>コミットに名前とメールアドレスが記録されます。GitHubへ公開する予定なら、GitHubのメール設定で案内される非公開用メールアドレスを使う方法もあります。</p>`);
let install=note('<b>この章はターミナル版（CLI）を使いたい人向け。</b>アプリのCodeだけを使う人は別インストール不要です。ネイティブ方式ならNode.js・npmも不要です。');
install+=step('1','公式のインストールコマンドを実行する',`${terminal}（Claudeのチャット欄ではありません）`,
`<p>${link(docs+'setup','Claude Code公式のセットアップページ')}の「Native Install」を使います。下の1行を「コピー」し、${terminal}に <b>${paste}</b> で貼り付けて、Enterを押してください。</p>`+code(mac?'curl -fsSL https://claude.ai/install.sh | bash':'irm https://claude.ai/install.ps1 | iex',`${pc}用・${terminal}で実行`)+ol(['コマンド全体を1行として入力します。行の先頭の <code>$</code> や <code>PS C:\\…&gt;</code> は入力しません。','途中で文字が流れても閉じずに待ちます。完了メッセージと、次の入力ができるカーソルを確認します。','「Setup notes」などの追加案内があれば読みます。PATHの案内がある場合は、下の「見つからないとき」を参照します。'])+note('このコマンドは <code>claude.ai</code> の公式インストーラーを取得して実行します。貼り付ける前にURLを確認してください。',true),
'完了メッセージが出て、コマンドの入力待ちに戻ります。');
install+=step('2','インストールを確かめる',`${terminal}を一度閉じて、新しく開く`,
`<p>新しく開いた${terminal}で、次のコマンドを実行します。</p>`+code('claude --version')+`<div class="terminal-example"><span class="mini-label">表示例（実行結果のイメージ）</span><pre>2.x.x (Claude Code)</pre><p>数字はインストールした版によって変わります。</p></div>`+`<p>続けて、設定やインストール状態の診断もできます。</p>`+code('claude doctor')+note('「claudeが見つからない」と出ても、すぐ再インストールを繰り返さなくて大丈夫です。06のPATHの手順を確認してください。'),
'Claude Codeのバージョンが表示され、診断に作業を妨げるエラーがありません。');
install+=mac?pic('mac-guide','MacのSpotlight、Terminalの入力、Applicationsへの追加の操作イメージ','操作箇所の見本です。図中の1〜3は実行順ではありません。中央のclaude --versionは、インストールが終わってから実行します。'):'';
install+=src(docs+'setup','公式のネイティブインストールと診断');
install+=detail('別のインストール方法は？',`<p>上のネイティブ方式を使えていれば、追加で実行しません。複数方式の混在は避けます。</p>${mac?`<p>Homebrewをすでに使っている人は、以下も公式に案内されています。</p>${code('brew install --cask claude-code')}`:`<p>WinGetが使えるPCでは以下も選べます。</p>${code('winget install Anthropic.ClaudeCode')}`}<p>この方式は自動更新ではありません。更新には ${mac?'<code>brew upgrade claude-code</code>':'<code>winget upgrade Anthropic.ClaudeCode</code>'} を使います。npm方式はこの初心者向け経路では使いません。</p>`);
let first=step('1','練習専用フォルダを作る',`${terminal}・1行ずつ実行`,
'<p>最初の練習では、自分で作った空のフォルダを使います。下のコマンドはホームフォルダの中に練習場所を作り、その場所へ移動します。</p>'+code(mac?'mkdir -p "$HOME/claude-practice"\ncd "$HOME/claude-practice"':'New-Item -ItemType Directory -Force -Path "$HOME\\claude-practice"\nSet-Location "$HOME\\claude-practice"')+`<p>現在の場所は <code>${mac?'pwd':'Get-Location'}</code> で確認できます。<code>claude-practice</code> で終わる場所になっていればOKです。</p>`,
'作業場所が練習用フォルダになっています。');
first+=step('2','Claude Codeを起動し、認証する',`${terminal} → ブラウザ → ${terminal}`,
code('claude')+ol(['初回の案内に従って進めます。文字の選択肢は、通常はキーボードの上下矢印で選び、Enterで確定します。','ログイン方法では、自分が契約しているClaudeアカウントの選択肢を選びます。APIのConsole課金を意図していなければ、そちらを選ばないでください。','ブラウザが開いたら、Claudeにログインして認証します。自動で開かない場合は、ターミナルに表示された認証用URLを自分のブラウザで開きます。','認証が終わったら、元のターミナルへ戻ります。コードの入力を求められた場合だけ、指示された認証コードをその画面に入力します。','フォルダを信頼するか確認されたら、場所が自分で作った <code>claude-practice</code> であることを確認して進めます。画面の順序・文言は版によって異なります。'])+note('認証用URL・コード・APIキーは、SNSや他人のチャットに貼らないでください。ここで使うのは自分の認証画面です。'),
'Claudeのメッセージ入力欄が表示されます。');
first+=step('3','日本語で依頼し、ファイルを1つ作る','起動したClaude Codeの入力欄／アプリのCodeでも同じ依頼が使えます',
`<p>最初に表示されている権限モードを確認します。ターミナルでは <code>Shift + Tab</code> で切り替えられます。変更を確認しながら進めたい場合はManual、計画だけ見たい場合はPlanを使います。</p>`+code('このフォルダに、自己紹介を書くための index.html を1つ作ってください。\n外部ライブラリは使わず、日本語で、名前は「サンプル」にしてください。\n作業前に何を作るか簡単に説明し、作業後に開き方を教えてください。','Claude Codeの入力欄に送信')+ol(['依頼を送ると、Claudeが作業内容を説明します。','承認を求められたら、変更先が練習用フォルダで、作るファイルが依頼どおりか確認します。問題なければ表示される承認操作で進めます。','自動で変更されるモードの場合も、完了後に変更内容を確認します。「必ず確認ダイアログが出る」とは限りません。','Finder／エクスプローラーで <code>claude-practice</code> を開き、<code>index.html</code> をダブルクリックしてブラウザで見ます。','修正したければ「見出しを青にして」のように追加で依頼します。'])+note('このHTML練習はNode.jsなしでできます。Reactなどのアプリを作るときは、別途Node.jsなどが必要になる場合があります。'),
'自分のPCで、作成したページが開きます。');
first+=step('4','終了する・次回もう一度開く','Claude Code内で終了 → PCのターミナルで再開',
code('/exit','Claude Code内で入力')+`<p>次回は${terminal}を開いて、練習フォルダへ移動して起動します。</p>`+code(mac?'cd "$HOME/claude-practice"\nclaude':'Set-Location "$HOME\\claude-practice"\nclaude')+table(['したいこと','入力する場所','操作'],[['機能を確認する','Claude Code内','<code>/help</code>'],['前の会話を選んで再開','Claude Code内','<code>/resume</code>'],['動作を止める','Claude Code内','<code>Esc</code>'],['別のアカウントでログイン','Claude Code内','<code>/login</code>'],['状態を診断する','PCのターミナル','<code>claude doctor</code>']]),
'終了と再起動の方法が分かりました。');
first+=src(docs+'quickstart','初回起動・基本操作');
let connect=table(['名称','役割','どこで設定？'],[['コネクタ','ClaudeからNotionやGoogle Driveなどを使う接続','Claudeの「Customize / カスタマイズ」→「Connectors」など'],['プラグイン','Skillや連携機能などをまとめた追加セット','Codeアプリの「＋」→「Plugins」、またはCLIの /plugin'],['MCP','Claudeと外部ツールをつなぐ共通の仕組み','コネクタ・プラグインの裏側でも使用。CLIから直接追加も可能']])+note('同じサービスを、プラグインとMCP直接設定の両方で重複して追加する必要はありません。まず使いたい画面に合う方法を1つ選びます。')+pic('connect-guide','外部サービスの選択、接続、権限確認とplugin画面の操作イメージ','図のSettingsは設定入口の模式表現です。現在の公式案内は「Customize → Connectors」、またはチャットの「＋ → Connectors → Manage connectors」です。');
connect+=step('A','Claudeアプリ・ブラウザからサービスをつなぐ','チャットの「＋」→ Connectors → Manage connectors',
`<p>例としてNotionを接続します。連携したいサービス側のアカウントも用意しておきます。</p>`+ol(['Claudeのチャット入力欄の左下にある「＋」をクリックします。','「Connectors（コネクタ）」→「Manage connectors（管理）」を開き、コネクタ見出し横の「＋」を押します。「Customize → Connectors」から開く方法もあります。','一覧でNotionを探して開きます。説明・できる操作・提供元を確認し、「Connect」または「Install」を押します。','Notionの認証画面が開いたら、自分のアカウントでログインします。求められたワークスペースやページ、アクセス権を確認して許可します。画面はサービスごとに異なります。','Claudeに戻り、接続済みの表示を確認します。必要ならチャットの「＋」→「Connectors」で、そのサービスを有効にします。','Notionに用意した練習ページの名前を指定して「このページを読み取り、要点だけ教えて。変更はしないで」と頼みます。'])+note('接続先にある「自分が閲覧できないページ」は、通常Claudeにも見えません。会社のTeam / Enterpriseでは管理者の許可が必要な場合があります。')+src('https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities','コネクタの公式設定方法'),
'接続済み表示に加え、指定した練習ページの内容を参照できました。');
connect+=step('B','Claude Codeに公式プラグインを追加する','Claude Code内の /plugin、またはアプリのCode → ＋ → Plugins',
`<p>ターミナル版のClaude Codeを起動した状態で、次を入力します。これはPowerShellやMacの通常の入力行に入れるコマンドではありません。</p>`+code('/plugin','Claude Codeの入力欄')+ol(['「Discover」タブに移動します。CLIではTab／Shift + Tabでタブを切り替え、矢印キーとEnterで項目を選びます。','公式のマーケットプレイス「claude-plugins-official」にあるNotionなど、使いたいプラグインを開きます。','追加される機能と設定要件を読みます。自分がすべてのプロジェクトで使うなら「User」、このプロジェクトだけなら「Local」を選びます。「Project」は共同作業者にも関係する設定です。','画面のInstallで追加します。反映・再読み込みの案内が出たら従います。必要ならClaude Codeを終了し、同じフォルダで起動し直します。','「Installed」で導入を確認します。外部接続を含む場合は <code>/mcp</code> を開き、認証が必要なら該当サービスを選んでログインします。','接続先の読み取りを試します。インストール済みでも、認証が済むまで外部データを使えないことがあります。'])+detail('公式マーケットプレイスが見つからない場合',`<p>Claude Code内で次を実行してから、もう一度 <code>/plugin</code> を開きます。</p>${code('/plugin marketplace add anthropics/claude-plugins-official','Claude Code内で入力')}<p>会社の設定で禁止されている場合は、管理者に確認します。</p>`)+note('アプリ版のCodeでは、入力欄横の「＋」→「Plugins」から追加できます。CLIの /plugin が使えない画面に、何度も同じコマンドを送らないようにします。',true)+src(docs+'discover-plugins','公式プラグインの追加・管理'),
'プラグインがInstalledにあり、必要な外部認証も完了しています。');
connect+=step('C','MCPでNotionに直接つなぐ','プラグインを使わず、CLIに接続先を追加する方法',
`<p>Notionのプラグインですでにつながっている場合は、この手順を飛ばします。ここでは練習プロジェクト内で使える接続を1つ作ります。</p>`+ol(['Claude Code内なら <code>/exit</code> で終了し、PCのターミナルに戻ります。','練習フォルダ <code>claude-practice</code> にいることを確かめます。','以下を実行して、公式ドキュメントに記載されたNotionの接続先を登録します。'])+code('claude mcp add --transport http notion https://mcp.notion.com/mcp',`${terminal}で実行`)+`<p>次に <code>claude</code> で起動し、Claude Code内で次を実行します。</p>`+code('/mcp','Claude Code内で入力')+ol(['一覧から「notion」を選び、認証が必要な場合はログイン／Authenticateの案内を選びます。','開いたブラウザでNotionにログインします。アクセス先や許可する権限を確認して進めます。','ターミナルに戻り、<code>/mcp</code> で接続状態と利用できるツールを確認します。','「Notionの『練習メモ』ページを探して要約して。変更はしないで」のように、実在する自分のページ名で読み取りを試します。'])+note('このHTTPSのリモート接続例では、MCP用にNode.jsやPythonを自分のPCへ追加する必要はありません。<code>npx</code> や <code>uvx</code> で動くローカルMCPサーバーとは必要な準備が違います。')+detail('接続を確認・削除するには',`${code('claude mcp list\nclaude mcp get notion','PCのターミナルで状態・設定を確認')}<p>このガイドで登録した接続を削除する場合：</p>${code('claude mcp remove notion','PCのターミナルで実行')}<p>これはClaude Code側の登録削除です。サービス側に与えた権限も取り消す場合は、Notionなど接続先の設定で連携アプリの許可を解除します。</p>`)+src(docs+'mcp','MCPの追加と認証'),
'登録だけでなく、接続状態と練習ページの読み取りまで確認できました。');
connect+=`<h3>つながると、何ができる？</h3><div class="service-grid"><article><h4>Notion</h4><p>保存した企画メモを探して、投稿案の材料をまとめる。</p><p>最初の依頼例：「練習用ページを要約して」</p></article><article><h4>Google Drive</h4><p>既存の資料を探し、複数ファイルの要点を整理する。</p><p>最初の依頼例：「指定した資料の要点を3つ教えて」</p></article><article><h4>GitHub</h4><p>リポジトリ・Issue・プルリクエストの情報を確認する。</p><p>必要な認証情報は公式プラグインの案内に従います。</p></article><article><h4>Figma / Slack</h4><p>対応するデザイン情報や、閲覧権限のある会話を参照する。</p><p>使える操作・プラン・管理者設定は各コネクタで確認。</p></article></div>${note('「接続できた」と「自動で投稿・送信する」は別です。最初は読み取りで試し、書き込みや送信を頼むときは、対象と内容を具体的に伝えます。')}`;
let help=`<p>エラー文を見て、当てはまる項目を開いてください。コマンドは「どこへ入力するか」を先に確認します。</p>`;
help+=detail('claude が見つからない／認識されない',
`<p>まず${terminal}をすべて閉じ、新しく開いて <code>claude --version</code> を試します。それでも出ない場合は、インストール時の「Setup notes」に従います。</p>${mac?`<p>macOS標準のZshでは、次の設定でインストール先をPATH（コマンドの検索場所）に追加できます。すでに設定済みなら繰り返す必要はありません。</p>${code('echo \'export PATH="$HOME/.local/bin:$PATH"\' >> ~/.zshrc\nsource ~/.zshrc','Macのターミナル・Zsh用')}<p><code>ls "$HOME/.local/bin/claude"</code> でファイルがない場合は、インストール完了前に失敗している可能性があります。</p>`:`<p>PowerShellで、インストール先が存在するか確認します。</p>${code('Test-Path "$env:USERPROFILE\\.local\\bin\\claude.exe"','PowerShellで実行')}<p>Trueなら、ユーザーのPATHへ追加します。以下は今あるPATHを残して追記する設定です。実行後はPowerShellを閉じ、新しく開いてください。</p>${code('$claudeGuidePath = [Environment]::GetEnvironmentVariable("PATH", "User")\n[Environment]::SetEnvironmentVariable("PATH", "$claudeGuidePath;$env:USERPROFILE\\.local\\bin", "User")','PowerShellで実行')}<p>FalseならPATHだけの問題ではありません。03のインストール結果を確認します。</p>`}${src(docs+'terminal-guide','公式のPATH対処方法')}`);
help+=detail('irm が認識されない／「&&」のエラーが出る',`<p>PowerShellとCMDのコマンドを混ぜている可能性があります。Windowsのスタートで「PowerShell」を検索し、先頭が <code>PS</code> の画面を開いてから、Windows用コマンドを実行してください。Claudeのチャット欄にインストールコマンドを貼ってもインストールにはなりません。</p>`);
help+=detail('Windowsで32-bitやx86のエラーが出る',`<p>「Windows PowerShell (x86)」を開いていたら閉じ、(x86)の付いていない「Windows PowerShell」を開きます。PC自体が32bitの場合はClaude Codeの対応条件を満たしません。設定→システム→バージョン情報でシステムの種類を確認します。</p>`);
help+=detail('Git Bashが見つからないと言われる',`<p>WindowsでGitをインストールした後、PowerShellを開き直します。通常の場所にインストールした場合、以下でファイルの存在を確認します。</p>${code('Test-Path "C:\\Program Files\\Git\\bin\\bash.exe"','PowerShellで実行')}<p>Trueの場合だけ、次を実行してからClaudeを起動します。この設定は現在のPowerShellウィンドウ内だけ有効です。</p>${code('$env:CLAUDE_CODE_GIT_BASH_PATH="C:\\Program Files\\Git\\bin\\bash.exe"\nclaude','PowerShellで実行')}<p>Falseの場合はインストールした場所を確認し、実際にあるbash.exeのパスを使います。最新の公式ではGitなしのPowerShell動作も案内されています。</p>`);
help+=detail('ログイン済みなのにCodeを使えない',`<p>契約しているアカウントとログイン先が同じか確認します。無料チャットへのログインだけではCodeの利用条件を満たしません。CLIなら <code>/login</code>、アプリならログインし直して再起動します。組織の管理設定や利用上限が原因の場合もあります。</p><p>APIキーを自分で設定していた人は、月額プランではなくAPI認証を優先していないかも公式の認証ガイドで確認してください。</p>${src(docs+'authentication','アカウントと認証')}`);
help+=detail('インストールが進まない／403・証明書のエラー',`<p>通信状態、対応OS、端末の管理制限を確認します。会社のネットワークなら管理者にエラー文を伝えます。HTMLの文字列が流れた場合、インストーラーではなくエラーページが返った可能性があります。</p><p>証明書の検証やセキュリティ機能を無効にして進めず、エラー文に対応する公式手順を確認してください。</p>${src(docs+'troubleshooting','インストールとログインのトラブル解決')}`);
help+=detail('プラグインは入ったのにサービスを読めない',`<p>CLIなら <code>/mcp</code> で接続状態を確認します。「要認証」ならログイン、「failed」なら詳細を読みます。プラグインのインストールと、外部サービスの認証は別工程です。</p><p>指定ページが自分のアカウントから見えるか、別のワークスペースに接続していないかも確認します。アプリでは対象コネクタが会話で有効か確認してください。</p>`);
help+=detail('Node.jsを入れるよう言われた',`<p>Claude Code本体のネイティブ導入には不要です。一方、作成中のJavaScriptアプリや、<code>npx</code> で起動するMCPには必要な場合があります。そのツールが指定する対応版を公式サイトから入れます。用途を確認してから追加しましょう。</p>`);
help+=detail('更新はどうする？',`<p>このガイドのネイティブインストールは自動更新に対応しています。手動で確認・更新する場合はClaude Codeを終了し、ターミナルで次を実行します。</p>${code('claude update\nclaude --version')}<p>HomebrewやWinGetで入れた場合は、そのパッケージ管理の更新コマンドを使います。インストール方式を混ぜないようにします。</p>`);
help+=`<div class="finish"><h3>ここまでできたら、準備完了。</h3><ul class="checklist"><li>Claudeにログインできた</li><li>選んだ方法でCodeを起動できた</li><li>練習用フォルダでファイルを作れた</li><li>必要なサービスを接続し、読み取りを試せた</li></ul><p>次は「作りたいもの」を、小さく1つ頼んでみましょう。</p></div>`;
let sources=`<p>仕様・画面・プランは変わることがあります。表示が違ったら、各手順の公式リンクと、お使いの画面の案内を優先してください。</p>${table(['用語','やさしく言うと'],[['ターミナル / PowerShell','文字でPCに指示するアプリ。WindowsではこのガイドはPowerShellを使います。'],['CLI','文字を入力して操作する使い方。アプリのボタン操作とは入口が違います。'],['PATH','「このコマンドはどこにある？」をPCが探す場所の一覧。'],['Git / GitHub','Gitは変更履歴を残す道具。GitHubはその履歴やファイルをオンラインで扱うサービス。'],['Node.js / npm','JavaScriptをPCで動かす仕組みと、その道具を管理する仕組み。必要な作業でだけ追加します。'],['プロジェクト / フォルダ','今回Claudeに作業してもらうファイルの置き場所。'],['OAuth','パスワードをClaudeに渡さず、サービス側の画面でアクセスを許可する認証の仕組み。'],['Skill','繰り返し使う手順や知識をまとめたもの。プラグインに含まれる場合もあります。']])}<h3>参照した公式資料</h3><ul class="source-list">${[
['https://claude.com/download','Claude公式ダウンロード'],[docs+'setup','対応環境・インストール・更新'],[docs+'terminal-guide','ターミナル初心者向け公式ガイド'],[docs+'quickstart','Claude Codeの最初のセッション'],[docs+'desktop-quickstart','アプリ版Claude Codeの導入'],['https://git-scm.com/install/mac','Git公式：Mac'],['https://git-scm.com/install/windows','Git公式：Windows'],[docs+'discover-plugins','プラグインの導入・管理'],[docs+'mcp','MCP接続・認証'],['https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities','Claudeのコネクタ設定']].map(([u,t])=>`<li>${link(u,t)}</li>`).join('')}</ul><h3>掲載画面について</h3><p>公式ダウンロード・Git・公式ドキュメントは2026年9月21日に撮影した実画面です。矢印やオレンジの枠は、このガイドで操作箇所を示すために追加しています。</p><p>PC内のインストーラーやログイン後の画面は、この環境で撮影できないためAI生成の操作イメージを使っています。生成画像は実画面ではなく、細部・配置・表示例が異なります。コマンドは画像から書き写さず、本文のコピーボタンを使ってください。</p><p class="source-line">このサイトはAnthropicの公式サイトではありません。Claude、Gitなどの名称・画面は各提供元に帰属します。</p>${pic('code-docs','Claude Codeの公式デスクトップ導入ガイド','公式ドキュメントも合わせて確認できます。','実画面キャプチャ')}`;
const prompt=(text)=>`<div class="prompt-card"><div class="mini-label">このお願い文をコピーして送る</div>${code(text,'Claudeアプリの「Code」→「Local」の会話欄')}</div>`;
const term=(word,meaning)=>`<p class="word-note"><b>${word}</b> ${meaning}</p>`;
const easySetup=`私は${pc}を使っている初心者です。このPCでClaude Codeを使って、簡単なWebページを作れるように準備してください。
まず、今の実行場所がこのPCなのか、別の仮想環境なのかを確認してください。このPCで確認できないことは、そのまま伝えてください。
選んだ練習用フォルダと、必要な道具が使えるかを実際に確認し、足りない準備だけ進めてください。すでに入っているものは入れ直さないでください。
Gitは変更履歴を残す必要がある場合に準備してください。Node.jsやターミナル版のClaude Codeなどは、今回の制作に必要な場合だけ提案してください。
必要なインストールは公式の配布元を確認し、何を追加するか短く説明してから、実行できる範囲で進めてください。
私にしかできないログイン、許可、管理者パスワードの入力、画面のクリックが必要なときだけ止まり、「どの画面の、何を押すか」を1つずつ教えてください。
最後に実際に動くかを確認して、「準備できたこと・未完了のこと・次の一歩」を日本語で教えてください。専門用語には短い説明を添えてください。`;
$('#requirements').innerHTML=`<h3>先に用意するのは、これだけ</h3><ul class="checklist"><li>${pc}とインターネット</li><li>Claudeアプリと、ログインするアカウント</li><li>Codeが使える契約（Pro / Max / Team / Enterpriseなど）</li></ul>${note('<b>GitやNode.jsを、先に全部そろえなくても大丈夫。</b>まずアプリのCodeを開き、やりたいことを伝えます。必要な道具の確認や追加作業は、Claudeに頼みましょう。')}<p class="source-line">対応プランやPCの条件は${link('https://claude.com/download','公式ダウンロード')}と${link(docs+'desktop-quickstart','公式の始め方')}で確認できます。</p>`;
let easyDownload=step('1',`${pc}用のClaudeアプリを入れる`,'ここは自分で操作します',
`<p>${link('https://claude.com/download','公式ダウンロードページ')}を開き、「Desktop」の欄を探します。</p>`+pic('download','Claude公式ページのOS別ダウンロードボタン','オレンジ枠のDownloadを押します。','実画面キャプチャ',ann(53.4,mac?21.1:28.5,8.3,4.6,mac?'Macはこちら':'Windowsはこちら'))+
(mac?ol(['「macOS」のDownloadを押します。','Finderの「ダウンロード」で、保存されたClaudeのファイルをダブルクリックします。','ClaudeとApplicationsが並んだら、ClaudeをApplicationsへドラッグします。別の案内なら、その画面に従います。','Finderの「アプリケーション」からClaudeを開きます。']):ol(['通常は「Windows」のDownloadを押します。ARMのPCなら「Windows (arm 64)」を選びます。','エクスプローラーの「ダウンロード」で、保存されたClaudeのセットアップファイルをダブルクリックします。','画面にインストールのボタンが出たら押し、完了を待ちます。','スタートメニューで「Claude」を検索して開きます。']))+
term('インストール＝','PCにアプリを入れて、使える状態にすること。スマホにアプリを入れるのと同じ感覚です。')+
(!mac?detail('通常のWindowsか、ARMか分からないとき','<p>スタート → 設定 → システム → バージョン情報の「システムの種類」を見ます。x64なら通常のWindows版、ARMならarm 64版を選びます。</p>'):''),
'Claudeアプリが開いたらOKです。');
easyDownload+=step('2','ログインして「Code」を開く','Claudeアプリの中で操作します',ol(['Claudeにログインします。契約がある人は、その契約と同じアカウントを使います。','「Code」と書かれたタブ・入口を押します。通常の相談用チャットとは入口が違います。','「Local」を選びます。これは「このPCで作業する」という意味です。','「Select folder」を押し、練習用の空フォルダを選びます。まだなければ、次の説明を見て作ってください。'])+
term('Code＝','Claudeにファイル作りやPC上の作業を頼める場所。プログラミング経験がなくても、日本語でお願いできます。')+term('フォルダ＝','ファイルを入れる箱。まずは練習用の箱を1つ用意します。')+
detail('練習用フォルダの作り方',mac?ol(['Finderを開き、メニューの「移動」→「ホーム」を選びます。','「ファイル」→「新規フォルダ」を押します。','名前を <code>claude-practice</code> にして、ClaudeのSelect folderでそのフォルダを選びます。']):ol(['WindowsキーとRを押し、<code>%USERPROFILE%</code> と入力してEnterを押します。これは自分専用のフォルダを開くための住所です。','開いたエクスプローラーで、何もない場所を右クリック →「新規作成」→「フォルダー」を選びます。','名前を <code>claude-practice</code> にして、ClaudeのSelect folderでそのフォルダを選びます。']))+
pic('first-session','ClaudeアプリのCode、Local、Select folderの操作イメージ','今回使うのは上段の「デスクトップ版」です。下段のターミナル版は、必要な人向けの別の入口です。実際の配置はアプリの版によって変わります。')+
note('Codeに進むところで「Gitが必要」と表示されたら、まずアプリを更新して開き直します。まだ進めない場合は、このページ下部の「自分で設定する方法」のGitの手順を使ってください。開始前の作業を、まだ開けないCodeに任せることはできません。'),
'Codeの会話欄が開き、作業するフォルダが選ばれています。')+src(docs+'desktop-quickstart','公式：アプリからCodeを始める');
let ask=step('3','セットアップを、Claudeにお願いする','下の文章をコピー → Codeの会話欄へ貼り付け → 送信',
`<p>ここからは「この文章を入力して」と何度もコマンドを打つ代わりに、Claudeに準備を頼みます。<b>アプリのCodeはすでに使えるので、改めてCode本体を入れる必要はありません。</b></p>`+
term('プロンプト＝','Claudeへの「お願い文」のこと。気の利いた呪文を覚える必要はありません。')+
prompt(easySetup)+
`<div class="role-grid"><div><span class="pill">Claudeが進める</span><p>使える道具を調べる／必要な設定を作る／許可された範囲で追加する／動作を確かめる</p></div><div><span class="pill optional">自分が担当する</span><p>ログイン／PCが求める許可／管理者パスワード／実行できない画面操作</p></div></div>`+
note('<b>通常のチャットでも相談できますが、PCへの自動設定には作業できる機能が必要です。</b>このガイドでは「Code → Local」を使います。別の場所で頼む場合は、このPCを操作できる機能が有効か確認してください。仮想環境の中に入った道具は、そのまま自分のPCで使えるとは限りません。')+
`<p class="source-line">このお願い文は本ガイドが作成した例です。公式の自動セットアップ機能や、全PCで無人完了することを保証するものではありません。</p>`,
'Claudeが実際の確認結果を返し、必要な作業を始めます。');
ask+=step('4','聞かれたところだけ、確認する','説明を読む → 必要なときだけ許可する',ol(['「何を追加するか」が表示されたら、今回の制作に必要なものか読みます。分からなければ「それは何のため？ 入れないと何ができない？」と聞いてOKです。','ログインやPCの確認画面は自分で操作します。パスワードをClaudeの会話欄に貼る必要はありません。','完了の返答が来たら、「実際に動作確認できたもの」を確認します。途中で止まった項目があれば、次のお願い文で続きを頼みます。'])+
prompt('準備が終わったものと、まだ終わっていないものを分けて教えてください。\n実際に動作確認した結果も、初心者向けに説明してください。\n未完了の項目は、あなたが進められる部分を進め、私の操作が必要なところだけ1つずつ案内してください。')+
detail('画面のクリックも頼みたい場合（対応環境のみ）',`<p>「Computer use」は、Claudeに画面を見てクリックなどをしてもらう機能です。通常のCodeで進められる作業なら、追加設定は不要です。</p><p>必要な場合はアプリのSettings（設定）→ General（一般、Desktop appの欄）→ Computer useを確認します。公式ではMac・WindowsのPro / Max向け試験機能として案内されています。Macでは「アクセシビリティ」と「画面収録」の許可も必要です。</p><p>項目がなければ対応プラン・アプリ更新を確認します。許可は操作できる範囲を広げる設定なので、画面の説明を読んで選びます。これを有効にしても、すべての操作が自動化できるわけではありません。</p>${src(docs+'desktop#enable-computer-use','公式：画面操作の設定')}`),
'準備済み・未完了がはっきりし、次の制作に進めます。');
ask+=detail('Gitだけ準備を頼みたいとき',term('Git（ギット）＝','作ったものの「セーブ履歴」を残す道具。前の状態を確かめたいときに役立ちます。')+prompt(`この${pc}でGitが使えるか確認してください。すでにあれば入れ直さないでください。\n必要なら公式の方法で導入を進め、私にしかできないクリックや許可だけ案内してください。\n実際にこのPCで動いたかを確認し、結果を教えてください。`));
ask+=detail('ターミナル版も使いたくなったら',term('ターミナル版＝','文字で操作する別の入口。アプリのCodeだけで作業するなら、今は追加しなくてOKです。')+prompt(`この${pc}で、ターミナルからもClaude Codeを使えるようにしたいです。\n今のインストール状況と実行環境を確認し、公式の推奨方法で、足りない準備だけ進めてください。\n重複インストールは避け、必要な許可やログインだけ私に案内してください。最後に起動確認までお願いします。`));
let easyFirst=step('5','小さなページを1つ作ってもらう','同じCodeの会話欄で、そのまま続けます',
prompt('練習用フォルダに、自己紹介のWebページを1つ作ってください。\n名前は「サンプル」。日本語で、明るく読みやすいデザインにしてください。\n追加のソフトなしで開ける、index.htmlというファイルにまとめてください。\n完成したら、私がどこを押せば見られるか教えてください。')+
term('HTML（エイチティーエムエル）＝','Webページの中身を書く形式。今回はClaudeが書くので、覚えなくても大丈夫です。')+
ol(['Claudeが作ったファイルのリンクを押します。アプリ内の表示画面で開ける場合があります。','自分で開く場合は、練習フォルダの <code>index.html</code> をダブルクリックします。','直したいところは「タイトルを大きくして」「背景を白にして」と日本語で頼みます。']),
'ページが表示されたら、使い始めるための準備はできています。')+detail('次の日に続きを頼むには','<p>Claudeアプリを開き、Codeで前の会話を選びます。新しい会話なら同じ練習フォルダを選び、「このフォルダのページを確認して、続きから手伝って」と頼みます。</p>');
let easyConnect=term('コネクタ＝','ClaudeとNotionなどをつなぐ「連絡通路」。')+term('プラグイン＝','Claudeに便利な機能を追加する「道具セット」。')+term('MCP（エムシーピー）＝','AIと外部サービスがやり取りするための共通ルール。まずは名前だけ知っていればOKです。');
easyConnect+=step('6','「Notionとつないで」と頼む','Codeの会話欄 → 必要な認証だけ自分で行う',
prompt('ClaudeからNotionの練習用ページを読めるようにしたいです。\nまず、今の環境ですでにつながっているか確認してください。\n未接続なら公式の連携方法を確認し、コネクタ、プラグイン、MCPのうち、今の環境で使える簡単な方法を1つ選んでください。同じ接続を重複して追加しないでください。\nあなたが設定できる部分は進めてください。私の操作が必要なら、開く画面と押すボタンを1つずつ教えてください。\nログインとアクセス許可は私が行います。最後に指定したページを読み取り、接続できたか確認してください。ページの変更はしないでください。')+
ol(['Claudeの案内に従い、Notionのログイン画面を開きます。','接続するアカウント・ワークスペース・許可する範囲を確認し、自分で認証します。','Claudeに戻り、練習用ページの名前を伝えます。','内容を読み取れたことを確認します。「追加できました」だけでなく、実際の読み取りまで確かめます。'])+
pic('connect-guide','接続するサービスを選び、アクセス範囲を確認する操作イメージ','操作できない画面は、Claudeに「どこを押すか」を案内してもらいます。現在の入口は本文のボタン手順を参照してください。')+
detail('Claudeが設定できない場合：ボタンだけで追加する',ol(['Claudeの通常の会話画面で「＋」→「Connectors」→「Manage connectors」を開きます。「Customize → Connectors」からも開けます。','見出し横の「＋」からNotionを選び、「Connect」または「Install」を押します。','ログイン・アクセス許可を済ませ、必要なら会話でコネクタを有効にします。','Codeに機能セットを追加したい場合は、Codeの「＋」→「Plugins」→「Add plugin」を使います。機能ごとの設定案内を読んで進めます。']))+
note('Google Driveなど、別のサービスでも「使いたいサービス名」と「やりたいこと」を伝えられます。できる操作は、そのサービスの対応機能や自分の権限によって変わります。')+src('https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities','公式：外部サービスの接続'),
'自分の練習用ページの内容が返ってきたら、接続確認完了です。');
let easyHelp=`<p>エラーが出たら、意味を全部調べる前に、その画面と「今やりたいこと」をClaudeに見せましょう。</p>`+
prompt(`私は${pc}の初心者です。セットアップ中に次のエラーが出ました。\n【ここにエラー文を貼る／画面を添付する】\n\n直前にしたこと：【ここに書く】\nやりたいこと：【ここに書く】\n\n原因をやさしい言葉で説明し、今のPCで確認できる範囲を調べてください。\nあなたが実行できる修正は内容を説明してから進め、私の操作が必要なときは1つずつ案内してください。\n「直った」と伝える前に、実際に確認できたことを教えてください。`)+
note('画面を添付する前に、パスワード・認証コードなどが写っていないか確認します。Code自体が開けない場合は通常のチャットに相談し、案内された操作を自分で進めます。')+
detail('Claudeが説明ばかりして、作業を進めてくれない',`<p>CodeのLocalを開いているか確認し、次のように頼みます。</p>${prompt('手順の説明だけでなく、この環境で実行できる作業は進めてください。\n実行できない作業は、その理由と私が行う操作を1つだけ教えてください。')}`)+
detail('「権限がありません」と言われた','<p>「権限」は、その操作をしてよいという許可のことです。ClaudeやPCが表示する許可の内容を読んで選びます。会社・学校のPCで制限されている場合は、管理者に相談してください。</p>')+
detail('「できました」と言われたけれど、動かない',`<p>別の作業環境に設定されたり、確認が不十分だった可能性があります。</p>${prompt('どのPC・どの場所に設定したか確認してください。\n実際に使えるかを再確認し、私のPCで使うために未完了のことがあれば教えてください。')}`);
const glossary=table(['言葉','ざっくり言うと','覚えておくこと'],[
['セットアップ','使い始めるための準備','アプリを入れる、ログインする、必要な設定をする、までを含みます。'],
['プロンプト','Claudeへのお願い文','日本語で「何をしてほしいか」を伝えればOK。'],
['Code / Local','作業する場所 / このPCで作業','今回のお願い文を入れる入口です。'],
['Git','制作のセーブ履歴','後から何を変えたか分かる道具。必要になったらClaudeに準備を頼めます。'],
['GitHub','制作物と履歴を置くオンラインの場所','Gitとは別物。最初の練習では登録不要です。'],
['Node.js','ある種類のアプリを動かすエンジン','すべての制作に必要ではありません。今回のHTML練習では不要。'],
['ターミナル / PowerShell','文字でPCへ指示する窓','WindowsではPowerShellという名前。アプリのCodeだけなら自分で開かずに進められます。'],
['コマンド','PC向けの短い指示','今回のメイン手順では、必要な実行をClaudeに任せます。'],
['CLI','文字で操作する使い方','ターミナル版のこと。アプリ版を使うなら別途入れなくてOK。'],
['コネクタ','サービスとの連絡通路','NotionやGoogle Driveなどとつなぎます。'],
['プラグイン / Skill','追加の道具セット / お仕事の手順書','必要な仕事に合うものだけ追加すればOK。'],
['MCP','AIと道具をつなぐ共通ルール','仕組みを全部覚えなくても連携できます。'],
['権限 / 認証','してよい操作 / 本人確認','許可する範囲やログインは自分で確認します。'],
['PATH','道具が置かれた場所の案内板','「入れたのに見つからない」ときに関係する設定。困ったときに調べればOK。']
]);
const manual=detail('必要な人だけ開く：Git・ターミナル版・MCPを自分で設定する',
`<p>Claudeが実行できない場合や、自分で仕組みを確認したいときの補足です。上の方法で使えていれば、ここを全部行う必要はありません。</p>`+
chapter('git','補足 A',`${pc}にGitを入れる`,'Gitは「制作のセーブ履歴」を残す道具です。',git)+chapter('install','補足 B','ターミナル版を追加する','文字で操作する入口も必要な人向けです。',install)+chapter('manual-first','補足 C','文字を入力して起動する','PCに直接指示する方法です。',first)+chapter('manual-connect','補足 D','連携を自分で設定する','コネクタ・プラグイン・MCPの詳しい設定。',connect)+chapter('manual-help','補足 E','エラー別の対処','表示されたエラーが分かる人向けです。',help));
$('#chapters').innerHTML=chapter('download','01','最初の操作だけ、自分で','アプリを入れる → ログイン → Codeで練習場所を選ぶ。',easyDownload)+chapter('ask','02','あとは、Claudeにお願いする','お願い文を貼って、準備と確認を進めてもらいます。',ask)+chapter('first','03','準備できたら、1つ作ってみよう','そのまま日本語で頼んで、動くところまで確認。',easyFirst)+chapter('connect','04','ほかのサービスも、つないでもらう','設定はできる範囲で任せ、ログインと許可は自分で。',easyConnect)+chapter('help','05','困ったら、こう聞けばOK','エラーの意味を覚えるところから始めなくて大丈夫。',easyHelp)+chapter('words','06','専門用語を、ふだんの言葉に','必要になったときだけ、ここへ戻ればOKです。',glossary)+chapter('manual','07','自分で設定したいときの補足','細かい設定方法は、こちらにまとめています。',manual)+chapter('sources','資料','公式の説明・画面について','現在の仕様は、公式ページでも確認できます。',sources.slice(sources.indexOf('<h3>参照した公式資料')));

for(const b of document.querySelectorAll('[data-os]'))b.setAttribute('aria-pressed',String(b.dataset.os===os));
}
render();
document.addEventListener('click',async e=>{
const osButton=e.target.closest('[data-os]');if(osButton){os=osButton.dataset.os;render();return;}
const copyButton=e.target.closest('.copy');if(copyButton){const text=copyButton.closest('.codebox').querySelector('code').textContent;try{await navigator.clipboard.writeText(text);copyButton.textContent='コピー済み ✓';setTimeout(()=>copyButton.textContent='コピー',1800);}catch{const range=document.createRange();range.selectNodeContents(copyButton.closest('.codebox').querySelector('code'));const sel=window.getSelection();sel.removeAllRanges();sel.addRange(range);$('#toast').textContent='文章を選択しました。Ctrl+C / ⌘Cでコピーしてください。';$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),5000);}return;}
const zoom=e.target.closest('.zoom');if(zoom){const img=zoom.querySelector('img');const modal=$('#image-modal');modal.querySelector('img').src=img.src;modal.querySelector('img').alt=img.alt;modal.querySelector('p').textContent=zoom.closest('figure').querySelector('figcaption').textContent;modal.showModal();return;}
if(e.target.closest('.close'))$('#image-modal').close();
});
$('#image-modal').addEventListener('click',e=>{if(e.target===$('#image-modal'))$('#image-modal').close();});
