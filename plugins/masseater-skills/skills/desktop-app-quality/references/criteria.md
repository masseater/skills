# 基準

## 1. アプリの入手とインストール

- **1.1** Windows はインストーラーが危険である可能性を警告しない
  - 根拠: すべての実行ファイルを Authenticode で署名する ([旧 Windows デスクトップアプリ認定要件 6.1](https://learn.microsoft.com/en-us/previous-versions/windows/win32/win_cert/certification-requirements-for-windows-desktop-apps))。SmartScreen のレピュテーションはダウンロード数に応じて上昇する。2024年以降、EV 証明書であっても最初の警告は解除されない ([コード署名オプション](https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/code-signing-options)、2026-11-10 更新)
- **1.2** アプリはSmart App Controlが有効なPCで動作する
  - 根拠: 2026年4月のアップデート以降、Windowsを再インストールしなくてもSmart App Controlを有効にできるようになった。署名のないアプリや評判の低いアプリをブロックし、ユーザーが一つずつ許可することはできない（[IT Pro guide to Windows 11 26H2](https://techcommunity.microsoft.com/blog/windows-itpro-blog/an-it-pro%e2%80%99s-guide-to-windows-11-version-26h2/4559760)、[Neowin](https://www.neowin.net/news/this-windows-11-feature-no-longer-requires-clean-installing-the-system-to-activate-it/)）。すべてのexe、すべてのDLL、およびすべての同梱ヘルパープログラム（サイドカー）には署名が必要だ
- **1.3** 日本国内の個人でもアプリに署名できる
  - 根拠: Azure Artifact Signing は米国とカナダの個人のみ受け付けている（コード署名オプション）。その他のオプションは、OV証明書（年額150〜300ドル、鍵はハードウェアまたはHSMに保管、2026-03-01以降最大460日間有効）と、OSI承認ライセンスの下でオープンソースソフトウェア向けに無料で利用できる [SignPath Foundation](https://signpath.org/terms) である。SignPath では発行元名が SignPath Foundation となり、全メンバーが多要素認証を必要とし、プロジェクトは「Free code signing provided by SignPath.io, certificate by SignPath Foundation」というテキストを表示しなければならない
- **1.4** macOSでは、ユーザーがアプリを開いても停止されない
  - 根拠: 開発者IDで署名し、公証を受け、チケットを staple する。公証には有料の開発者プログラムが必要だ。アドホックな署名では、アプリを許可するためにユーザーが踏むべき手順が削除されない ([Tauri: macOS signing](https://v2.tauri.app/distribute/sign/macos/))。Sequoia以降、Control-clickによる回避策はない ([AppleInsider](https://appleinsider.com/inside/macos-sequoia/tips/whats-changed-in-runtime-protection-for-macos-sequoia))
- **1.5** 古いインストーラーが突然インストールを停止することはない
  - 根拠: 古いDeveloper ID Sub-CAは2027-02-01に期限が切れる。そこからの証明書で署名された.pkgはインストールされなくなる。G2証明書で再署名すること。セキュアなタイムスタンプが付いた公証済みアプリは動作し続ける ([Apple Developer News 2026-10-01](https://developer.apple.com/news/))
- **1.6** OSは起動直後にアプリを強制終了しない
  - 根拠: macOS 26.5以降では、AMFIがデフォルトの16KBページサイズで署名された大容量バイナリを強制終了するという報告がある ([tauri #15801](https://github.com/tauri-apps/tauri/issues/15801), 2026-07)
- **1.7** 管理者権限なしでアプリがインストールされ、サイレントインストールをブロックせず、強制再起動も行わず、失敗した場合はロールバックする
  - 根拠: 旧認定要件 5.1, 5.2, 5.4, 10.1 および 10.2。Windows 26H2 の管理者保護（2026-09-29 より一般利用可能、10 月のアップデート以降、セキュリティベースラインではデフォルトで利用可能）では、すべての昇格時に Windows Hello の使用が求められる。昇格したプロセスは別プロファイルで動作するため、ユーザーごとのパスや HKCU への書き込みは別のプロファイルに入る。ユーザーごとのインストールの方が安全である ([MC1506291](https://mc.merill.net/message/MC1506291))
- **1.8** ダウングレードをブロックする設定が動作する
  - 根拠: Tauri 2.12.3 (2026-10-10) で `allowDowngrades=false` の NSIS がダウングレードをブロックしないバグを修正した ([Tauri リリース](https://v2.tauri.app/release/tauri/))
- **1.9** アプリはユーザーが所有するPCで動作する
  - 根拠: macOS 27はAppleシリコンでのみ動作し、macOS 27がRosetta搭載の最後のリリースとなる。macOS 27により、Intel製アプリは「macOS 28では動作しない」とされるようになった（[macOS 27リリースノート](https://developer.apple.com/documentation/macos-release-notes/macos-27-release-notes)）。Arm版Windowsは2026年時点でノートPCの約3〜6%を占める（[TrendForce推計](https://www.trendforce.com/news/?p=57911)。推計値はソースにより異なる）。Linuxでは、glibcの影響でUbuntu 22.04などの古いベースでAppImageがビルドされており、70MBを超えることが多い（[Tauri: AppImage](https://v2.tauri.app/distribute/appimage/)）
- **1.10** ユーザーは馴染みのある提供元からインストールできる
  - 根拠: 以下の表を参照

### 配布先ごとの条件

| 配布先 | 主な条件 | 最近の動き |
|---|---|---|
| Mac App Store | App Sandboxが必須。アプリにはentitlements、`ITSAppUsesNonExemptEncryption`、およびMac Installer Distribution証明書で署名された.pkgが必要である（[Tauri: App Store](https://v2.tauri.app/distribute/app-store/)）。外部コマンドラインツールを起動するアプリは、サンドボックス内での受け渡しが困難である | 2026-10-16のリビジョンにより、隠し機能の削除（2.5.19）および審査後に内容を変更するアプリの削除が明示化された。2026-06には、低価値アプリに対するルール4.3(b)がより厳格になった（[9to5Mac](https://9to5mac.com/2026/10/16/apples-new-app-store-rules-crack-down-on-ai-nudification-and-bait-and-switch-apps/)、[MacRumors](https://www.macrumors.com/2026/06/09/app-store-guidelines-low-quality-apps/)）。2027-01-12までに、新たな年齢制限に関する質問が義務付けられる |
| Microsoft Store | ストアポリシー 7.20（2026-09-15公開、2026-10-22施行）。Win32 EXEおよびMSIの場合、すべてのPEファイルはMicrosoft Trusted Root Programに紐づく証明書で署名され、インストーラーはサイレントインストールに対応し、かつバージョン付きURL（10.2.9）でのスタンドアロンインストーラーである必要がある。Win32アプリには常にプライバシーポリシー（10.5.1）が必要である。アプリは迅速に起動し、レスポンス良く動作し、クリーンに終了しなければならない（10.4.2）。Windowsの設定を変更する前に同意を求める必要がある（10.2.8）。通知設定を遵守しなければならない（10.9）。クリーンにアンインストールしなければならない（10.2.7）（[ストアポリシー](https://learn.microsoft.com/en-us/windows/apps/publish/store-policies)）。Tauriの場合、WebView2を`offlineInstaller`に設定し、パブリッシャー名をproductNameと同じにしないこと（[Tauri: Microsoft Store](https://v2.tauri.app/distribute/microsoft-store/)）。| 個人開発者の登録は無料である（[Windows Blog 2025-09-10](https://blogs.windows.com/windowsdeveloper/2025/09/10/free-developer-registration-for-individual-developers-on-microsoft-store/)）。ストアはMSIXパッケージを無料で再署名するが、TauriはMSIXをビルドしない |
| winget | 署名は不要である。代わりに、インストーラーは複数のウイルス対策エンジンでスキャンされ、Defenderの動的解析、管理者および一般ユーザー双方による無人インストール・インストールおよび削除、アンインストール後の残骸（`Validation-Uninstall-Error`）、および一致するハッシュによってチェックされる。インストーラーは、リダイレクトなしにパブリッシャーのサイトからHTTPS経由で直接ダウンロード可能でなければならない ([wingetリポジトリ](https://learn.microsoft.com/en-us/windows/package-manager/package/repository), [ポリシー](https://learn.microsoft.com/en-us/windows/package-manager/package/windows-package-manager-policies)) | − |
| Flathub | アプリは完全なソースビルドである必要があり、ビルド中にネットワークアクセスを許可してはならない。権限は最小限に留め、ポータルが存在する場合は必ず使用すること。アプリには英語のUI、メタ情報、`.desktop`ファイル、および256px以上のアイコンが必要である。単純なウェブラッパーは認められない。FlathubではAI生成コード、ドキュメント、およびパッケージの開示が求められ、マニフェスト内へのAI生成コンテンツの混入や、AIエージェントによる提出PRの作成またはテキストの書き込みが禁止されている（[要件](https://docs.flathub.org/docs/for-app-authors/requirements)、生成AIポリシー）。任意の[品質ガイドライン](https://docs.flathub.org/docs/for-app-authors/metainfo-guidelines/quality-guidelines)を満たすことで、掲載されやすくなる | GNOME SoftwareおよびUbuntu App Centerでは、インストール前にFlatpakおよびsnapの権限が表示されるようになった（GNOME 51、Ubuntu 26.10）。ユーザーは広すぎる権限を確認できる |

## 2. アプリを開く

- **2.1** アプリはすぐに使える状態になっている。「起動」画面やスプラッシュ画面は表示されない
  - 根拠: HIGでは即時起動し、起動画面を広告に使用しないよう指示されている（[起動](https://developer.apple.com/design/human-interface-guidelines/launching)）。DiscordのRust書き換え版は、起動画面を削除した可能性が高いと報じられている（[Windows Latest 2026-11-05](https://www.windowslatest.com/2026/11/05/discord-is-killing-its-electron-app-that-can-eat-4gb-of-ram-on-windows-11-and-the-rust-rebuild-uses-just-290mb/)）
- **2.2** 起動時に白や黒の点滅なし
  - 根拠: Electronは背景色を設定し、描画完了後にウィンドウを表示することを推奨している（[BrowserWindow](https://www.electronjs.org/docs/latest/api/browser-window)）。Raycastはウィンドウが透明な状態で前面に表示し、描画後に表示する
- **2.3** アプリがユーザーの中断したところから続き、ウィンドウやスクロール位置も含まれる
  - 根拠: HIGでは再起動後に前の状態に戻すとある。VS Codeは `window.restoreWindows` とホットエグジットでウィンドウや未保存の内容を復元する ([VS Code](https://code.visualstudio.com/docs/editing/codebasics))
- **2.4** 初回利用のガイダンスは短く、スキップ可能で、必要な箇所に表示される。大容量のダウンロードでも初回利用が妨げられない
  - 根拠: HIGは、事前の長いフローよりも文脈に沿った簡潔なヒントを好み、不要なセットアップは後回しにし、妥当なデフォルト設定から始めるよう推奨している ([Onboarding](https://developer.apple.com/design/human-interface-guidelines/onboarding), 2024-06-10)
- **2.5** ローカル機能はアカウント不要
  - 根拠: Affinityは無料化と同時にCanvaアカウントが必要となり、反発を招いた([MacRumors 2025-10-31](https://www.macrumors.com/2025/10/31/canva-relaunches-affinity-free-app/))。Insomniaはアカウント必須となったことで反発を招き、ローカル限定のプロジェクトが復活した([GitHub](https://github.com/Kong/insomnia/discussions/6626))。モバイルレビューでは、広告に次いでログインに関する不満が多い
- **2.6** ネットワークがない状態での起動時の警告なし
  - 根拠: HIGは起動時のアラートを禁止している。ネットワークがない場合、アプリはローカルデータと静かなインジケーター（[アラート](https://developer.apple.com/design/human-interface-guidelines/alerts)）で起動すべきである。

## 3. タイピングと入力

### 日本語入力

- **3.1** IME変換を確定する Enter キーは、何も送信・提出しない。これはメイン入力だけでなく、名前変更、コメント、検索フィールドを含むすべてのフィールドで同様である
  - 根拠: Claude Desktop では、メイン入力が修正された後、他のフィールドで同様のバグが繰り返し発生した ([claudeissues #30540](https://claudeissues.com/issue/30540-bug-claude-desktop-ime-composition-enter-key-triggers-submission-in-plan-feedbac))。WebKit (Safari および WKWebView) では、変換を確定する Enter キーに `isComposing === false` のまま届くことがある ([WebKit bug 165004](https://bugs.webkit.org/show_bug.cgi?id=165004))。`isComposing` と `keyCode === 229` の両方を確認すること（[Chrome](https://developer.chrome.com/docs/modern-web-guidance/guides/forms/ime-safe-enter-submit), [azukiazusa](https://azukiazusa.dev/blog/ime-enter-submit)）。日本の Slack ユーザーは、送信時に Cmd+Enter を設定することでこの問題を回避している
- **3.2** 変換中のテキストが挿入箇所に表示され、候補ウィンドウがカーソルの横に現れる
  - 根拠: Windows (WebView2) では、ウィンドウ切り替え後に候補ウィンドウが画面左上にジャンプする ([tauri #16391](https://github.com/tauri-apps/tauri/issues/16391), 2026-10)。CJK入力では初回フォーカスでTSFがフリーズする (#15436, 2026-05)。macOSではサードパーティ製IMEが最初のキーストロークを失う (#15924, 2026-08)。組み立て中のハングルの置き換えはキーダウン前に適用されるため、diffで入力を追跡するコードは見逃す ([xterm.js #6284](https://github.com/xtermjs/xterm.js/issues/6284))。LinuxではTauriが変換中のテキストを表示せず、修正のPRが未完了のままである ([wry #1724](https://github.com/tauri-apps/wry/pull/1724), 2026-05)。候補ウィンドウが入力欄から離れた場所に現れる ([tauri #11412](https://github.com/tauri-apps/tauri/issues/11412))。CodeMirror 6とChromeのEditContextでは候補が左上にも現れた ([CodeMirror](https://discuss.codemirror.net/t/issue-with-google-japanese-ime-cursor-position-in-v6/8810))
- **3.3** 変換中のテキストが消えない
  - 根拠: Mac版ChatGPTアプリで、日本語と中国語の変換中のテキストが消えた（[OpenAI Community 2025-02-12](https://community.openai.com/t/chatgpt-mac-app-input-bug-with-cjk-imes/1118775)、1件の報告）
- **3.4** アプリが複数の IME で確かめられている
  - 根拠: VS Codeには手動のIMEテストプランがある（[VS Code wiki](https://github.com/Microsoft/vscode/wiki/IME-Test)）。テスト例はATOK、MS-IME、Google日本語入力、macOS標準IME、Mozc付きfcitx5など。WKWebViewやWebKitGTK上のIMEは自動テストできない（第19章）
- **3.5** 日本語が中国語の字形で表示されず、Windows で細すぎない
  - 根拠: Electronでは言語設定がChromiumまで届かず、漢字が中国語フォントで表示された（[electron #23247](https://github.com/electron/electron/pull/23247)）。WindowsのYu Gothicはデフォルトの太さでは読みにくい（[Obsidian Forum](https://forum.obsidian.md/t/incorrect-font-for-japanese-on-windows-and-publish/59629/8)）

### キーボード

- **3.6** OS の標準のショートカットはそのままで、別のものを意味しない
  - 根拠: [HIG: キーボード](https://developer.apple.com/design/human-interface-guidelines/keyboards)、[Windowsのキーボードアクセラレータ](https://learn.microsoft.com/en-us/windows/apps/design/input/keyboard-accelerators)（2026-08-28、標準のものはCtrl+Z、Y、F、S、W、P、0、プラスマイナス、F3、F6）、[GNOME標準のショートカット](https://developer.gnome.org/hig/reference/keyboard.html)
- **3.7** macOSのテキストナビゲーションキー（矢印付きのOptionまたはCmd、Ctrl-A、Ctrl-E、Ctrl-K）は動作する
  - 根拠: カスタムエディタでは簡単に動作しなくなる。ProseMirrorにもCtrl-AとCtrl-Eが動作しないバグがあった ([ProseMirror](https://discuss.prosemirror.net/t/shortcut-ctrl-a-ctrl-e-dont-work-on-macos-with-inline-node/4328))
- **3.8** すべての操作をキーボードから行えるほか、メニューやツールチップからショートカットを学習できる
  - 根拠: メニューにカスタム操作がある場合、ショートカットを設定でき、フルキーボードアクセス（[HIG: メニューバー](https://developer.apple.com/design/human-interface-guidelines/the-menu-bar)）を利用できる。Windowsでは、「コピー (Ctrl+C)」のようなショートカットがツールチップに表示され、Altで始まるアクセスキー（[アクセスキー](https://learn.microsoft.com/en-us/windows/apps/design/input/access-keys)）が追加される。GNOMEでは、すべての操作をキーボードから操作可能にし、Ctrl+? のリストを表示する。VS Code、Linear、Zedでは、コマンドパレットからすべての操作にアクセスできる。Slackでは、Cmd/Ctrl+/のリストを、Linearでは? を表示している。
- **3.9** ショートカットは言語とキーボード配列に適合している
  - 根拠: Windowsは言語ごとにアクセラレータを変更する（スペイン語では「太字」が Ctrl+N）。macOSにおけるElectronのグローバルショートカットは、QWERTY以外の配列では長らく動作しなかった ([Electron docs](https://electronjs.org/docs/latest/tutorial/keyboard-shortcuts))
- **3.10** ユーザーはショートカットを変更できる
  - 根拠: VS Code や Zed では、ショートカットエディタが JSON ファイルに書き戻す
- **3.11** キー操作がないときはビープ音が鳴らない
  - 根拠: macOSのWKWebViewで、フォーカスされていない状態でキーを押すとアラート音（[akr](https://dev.to/akr/8-tips-for-creating-a-native-look-and-feel-in-tauri-applications-3loe)）が鳴る

### マウスと選択

- **3.12** ボタンやリンクの上でカーソルが指の形にならない。押せることはホバーの見た目で示す
  - 根拠: Raycast は、指の形のカーソルは「これはウェブサイトだ」と伝えてしまうと書いている。Microsoft も、押せる要素の上で矢印のままにするよう勧めている（[マウス操作](https://learn.microsoft.com/windows/apps/develop/input/mouse-interactions)）
- **3.13** ボタンやラベルのテキストはドラッグで選択できない。編集可能なテキストの上にのみIビームが表示される
  - 根拠: [ToDesktop 2025-01-18](https://www.todesktop.com/blog/posts/designing-desktop-apps-cross-platform-ux), [native-feel-skill](https://raw.githubusercontent.com/yetone/native-feel-skill/master/references/06-native-conventions.md)
- **3.14** UI の画像やリンクを誤ってウィンドウの外へドラッグできない
  - 根拠: 上記と同様
- **3.15** 右クリックしてもブラウザメニュー（戻る、再読み込み、検証）は表示されない。メニューが表示される場合でも、該当箇所に収まる項目が数件しかなく、テキストフィールドはコピー＆ペーストのままになる
  - 根拠: WebView2の右クリックメニューは無効化できる ([wry 0.50.5](https://v2.tauri.app/release/wry/v0.50.5))。Tauriは `Menu.popup()` でネイティブメニューを表示でき、ページは `contextmenu` に対して `preventDefault` を呼び出す。AppleのHIGでは、項目数を少なめに抑え、メニューバーにも同様のコマンドを配置することを推奨している ([Context menus](https://developer.apple.com/design/human-interface-guidelines/context-menus))
- **3.16** ドラッグ＆ドロップはどこでも動作し、元に戻すこともできる。ウィンドウにファイルをドロップすると開き、何かを外へドラッグすると実際のファイルが作成される
  - 根拠: [HIG: ドラッグ＆ドロップ](https://developer.apple.com/design/human-interface-guidelines/drag-and-drop)。Windows版Tauriでは、ファイルドロップをオンにするとHTML5のドラッグ＆ドロップが停止する (#15138)。アプリの実行中は切り替えられない (#13189)。外へのドラッグは 2021 年から未対応のままである (#2593)

## 4. ブラウザの痕跡の除去

- **4.1** Ctrl/Cmd+R や F5 は画面の再読み込みを行わず、作業が中断されない。Ctrl+F や Ctrl+P はブラウザの機能を開かない
  - 根拠: WebView2 はデフォルトでブラウザのキー（再読み込み、検索、印刷、拡大）を有効化する ([AreBrowserAcceleratorKeysEnabled](https://learn.microsoft.com/dotnet/api/microsoft.web.webview2.core.corewebview2settings.arebrowseracceleratorkeysenabled))。Tauri では [tauri-plugin-prevent-default](https://docs.rs/crate/tauri-plugin-prevent-default) がこれらをブロックする
- **4.2** ウィンドウ全体が跳ねない。内部のスクロール領域はmacOSのように跳ねる
  - 根拠: 1Passwordが内部の跳ね返りを削除し、ユーザーから復活を求める声が上がった ([1Password Community](https://www.1password.community/1password-at-home-31/please-add-back-in-over-scroll-on-macs-11227))
- **4.3** 2本指でスワイプしても「戻る」が起きない
  - 根拠: `overscroll-behavior: contain` ([WebKit bug 240892](https://bugs.webkit.org/show_bug.cgi?id=240892))
- **4.4** 画面切り替えがページ遷移のように見えない
  - 根拠: Raycastで切り替え時のちらつきが解消された
- **4.5** ツールチップやポップオーバーがウィンドウの端で切れないようにする
  - 根拠: Raycast はネイティブウィンドウにツールチップを描画し、メインウィンドウの外側まで広げることができる
- **4.6** スクロール位置が単独で移動しない
  - 根拠: Safari 27 および WKWebView (2026-09-14) ではデフォルトでスクロールアンカーが有効になった。これは macOS 26 および Sequoia でも同様である ([Safari 27 リリースノート](https://developer.apple.com/documentation/safari-release-notes/safari-27-release-notes))

## 5. ウィンドウと画面

- **5.1** 位置、サイズ、および最大化状態は次の起動時に復元される。ディスプレイ設定が変更されると、ウィンドウが画面に戻る
  - 根拠: Teamsは、毎回最大化して開く点で批判された ([tyler.io](https://tyler.io/2021/03/20/mortal-mac-app-sins/))。生の座標を保存するアプリは、以前は切断されたモニターがあった場所にウィンドウを開く（Raymond Chen）。Windowsでは、`SetWindowPlacement` によって完全に画面外にあったウィンドウが画面に戻る ([Learn](https://learn.microsoft.com/windows/win32/api/winuser/nf-winuser-setwindowplacement))。Tauriの [window-state プラグイン](https://v2.tauri.app/reference/javascript/window-state/) は、保存された位置がどのモニターとも重ならない場合、位置をOSに委ねる。しかし、多くのバグがある。macOSでは2倍のサイズで復元され (#3521)、自動保存機能がなく (#3474)、ズームレベルが保存されない (#3350)。Waylandでは、アプリがウィンドウ位置を設定できない。GTK4はGNOME 51の `xdg-session-management-v1` で復元機能を実現したが、TauriはGTK3を使用しており、この恩恵を受けない ([GNOME 51](https://release.gnome.org/51/developers/))
- **5.2** ウィンドウはタイトルバーで移動でき、ダブルクリックでOSの設定通りになる
  - 根拠: カスタムタイトルバーでこれを再構成する必要がある ([DoltHub 2025-02-11](https://www.dolthub.com/blog/2025-02-11-building-a-custom-title-bar-in-electron/))
- **5.3** Windows 11 の最大化ボタンにスナップレイアウトが表示される
  - 根拠: カスタムボタンにはネイティブな応答が必要 ([Learn](https://learn.microsoft.com/windows/apps/desktop/modernize/apply-snap-layout-menu))
- **5.4** 全画面はOSの全画面を使用し、抜けた後は元の作業に戻れる
  - 根拠: [HIG: 全画面にする](https://developer.apple.com/design/human-interface-guidelines/going-full-screen)
- **5.5** 背景のウィンドウの方が静かに見える
  - 根拠: [Demedes](https://dev.to/vadimdemedes/making-electron-apps-feel-native-on-mac-52e8)
- **5.6** 2回目の起動で既存のウィンドウが前面に
  - 根拠: [native-feel-skill](https://raw.githubusercontent.com/yetone/native-feel-skill/master/references/06-native-conventions.md)。TauriのシングルインスタンスプラグインがWindowsで10秒待機後に諦めるようになった（2026-10-10）
- **5.7** レイアウトはリサイズにスムーズに追従し、重要なコントロールは下端に配置されていない
  - 根拠: [HIG: Windows](https://developer.apple.com/design/human-interface-guidelines/windows)
- **5.8** 倍率の異なるディスプレイでアプリがぼやけたり崩れたりしない
  - 根拠: MicrosoftはPer-Monitor v2 DPI awarenessを推奨しており、Tauriのtaoもそれを宣言している（[Learn](https://learn.microsoft.com/windows/win32/hidpi/high-dpi-desktop-application-development-on-windows)）。LinuxではGTK3が分数スケーリングに対応していないため、GNOMEではWebKitGTKのコンテンツがぼやける（[WebKit bug 271714](https://bugs.webkit.org/show_bug.cgi?id=271714)）。また、WaylandではWebKitが2 倍の画面で半分の大きさに描かれるという報告もある（[wry #1727](https://github.com/tauri-apps/wry/issues/1727)）
- **5.9** アプリは大きなテキストに対するOSの設定に従う
  - 根拠: Windowsでは、「Make text bigger」がWebView2でページ全体を拡大する (WebView2Feedback #3699)。WebKitGTKはGNOMEの大きなテキスト設定 (`text-scaling-factor`) を無視する ([WebKit bug 259309](https://bugs.webkit.org/show_bug.cgi?id=259309))
- **5.10** HDR画像は白飛びしない
  - 根拠: Safari/WebKit 26 および Chrome/Edge 136 以降では `dynamic-range-limit` に対応しているため、WKWebView と WebView2 はこの点で大差ない ([WebKit 26.0](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/))

## 6. 作業を失わない

- **6.1** 保存を意識しなくても、利用者が戻したり消したりするまで作業が残る
  - 根拠: HIG は作業中の自動保存をアプリに求める（[ファイル管理](https://developer.apple.com/design/human-interface-guidelines/file-management)）。VS Codeは終了後もデフォルトで未保存コンテンツを保持し、クラッシュ後に復元する
- **6.2** 未完成の文章や作業中の作業は、アップデートやクラッシュ、再起動でも失われない
  - 根拠: Claude Desktopの自動アップデートで作業中のセッションが消去されたという報告がある（anthropics の issue #92196 と #94205。検索の要約でしか読めていない）
- **6.3** ユーザーは前の状態に戻せる
  - 根拠: Obsidianは5分ごとに7日間ローカルスナップショットを保持する（[ファイルの復元](https://obsidian.md/help/plugins/file-recovery)）。GitButlerは常に変更前にスナップショットを取得する（[タイムライン](https://docs.gitbutler.com/features/timeline)）。Notionはプランに応じて7〜90日間バージョンを保持する
- **6.4** Undoは何度でも実行でき、確認ダイアログの代わりにUndoが使用される
  - 根拠: [HIG: Undo and redo](https://developer.apple.com/design/human-interface-guidelines/undo-and-redo)（Undo Typingなど、項目名に対象を入れる）、[HIG: Alerts](https://developer.apple.com/design/human-interface-guidelines/alerts)、[GNOME HIG: Principles](https://developer.gnome.org/hig/principles.html)
- **6.5** ユーザーは開ける形式でデータを出力できる
  - 根拠: ObsidianはローカルのMarkdownファイルを使用している点が評価されている ([podfeet 2026-02](https://www.podfeet.com/blog/2026/02/obsidian-ed-tobias/))。HIG は、複製には Duplicate を、普段扱わない形式への書き出しには Export を使うよう勧めている
- **6.6** 同期の競合で片方が黙って削除されることはない
  - 根拠: Obsidian Sync はデフォルトで自動的にマージされ、1.9.7 以降は各デバイスが代わりに「(Conflicted copy …)」ファイルを作成できる ([Obsidian](https://help.obsidian.md/sync/troubleshoot))。iCloud Drive はどちらのバージョンを残すか尋ねる。Notion はページのデータを CRDT に移した ([Notion 2025-12-11](https://www.notion.com/blog/how-we-made-notion-available-offline))
- **6.7** クラウドフォルダ内のファイルは壊れない
  - 根拠: iCloudの「Mac Storageの最適化」は、ファイルを中身のないプレースホルダーに置き換え（データレス）、Appleは作業中のプロジェクトをiCloud Driveの外に置くことを推奨している（[Eclectic Light](https://eclecticlight.co/2024/03/11/icloud-drive-in-sonoma-optimise-mac-storage-or-not/)）。OneDriveのプレースホルダーは通常の読み取り時にダウンロードが始まり、数秒後に進捗が表示される（[Learn](https://learn.microsoft.com/windows/win32/cfapi/build-a-cloud-file-sync-engine)）。Dropboxは同時編集時や、別のマシンでファイルを開いたままの時に「競合コピー」を作成する（[Dropbox](https://help.dropbox.com/organize/conflicted-copy)）
- **6.8** OSが定義する場所にデータが格納される
  - 根拠: Linuxでは、設定を `XDG_CONFIG_HOME`、データを `XDG_DATA_HOME`、ログ・履歴・ウィンドウレイアウトを `XDG_STATE_HOME`、削除可能なものを `XDG_CACHE_HOME` に配置する（[XDG Base Directory 0.8](https://specifications.freedesktop.org/basedir/latest/)）。Windowsでは、インストールフォルダにユーザーデータを配置しない
- **6.9** 更新でデータ形式が変わっても古いデータは壊れない
  - 根拠: −

## 7. 速度と軽さ

- **7.1** 端末の中で済む操作に読み込み中の表示が出ない。200 ms未満では何も表示されず、時間がかかると進捗が表示される
  - 根拠: [native-feel-skill](https://raw.githubusercontent.com/yetone/native-feel-skill/master/references/06-native-conventions.md), [HIG: Loading](https://developer.apple.com/design/human-interface-guidelines/loading)。NN/g の目安では、0.1秒は即時的に感じられ、1秒はフローを維持し、10秒は注意力を失わせる。1〜10秒はスピナーを、それ以降は推定値付きの進捗バーを使用する ([NN/g](https://www.nngroup.com/videos/3-response-time-limits-interaction-design/))。Linearはまずローカルコピーに書き込み、バックグラウンドで同期する
- **7.2** タイピングが遅延せず、アプリがフリーズしない
  - 根拠: macOSではメインスレッドのストールが250 ms以上になるとハングとなり、Xcode Organizerでは1時間あたりのハング秒数が表示される（[Apple](https://developer.apple.com/documentation/xcode/analyzing-responsiveness-issues-in-your-shipping-app)）。Windowsでは、ユーザー操作中に5秒間メッセージを処理しないウィンドウが「応答なし」となり、ユーザーが強制終了できる（[WER](https://learn.microsoft.com/windows/win32/wer/using-wer)）。ストアではアプリの応答性が維持される必要がある（10.4.2）
- **7.3** アイドル時のメモリは数百MB以内
  - 根拠: Discordは4GBを超えた際に自動で再起動する仕組みを試した ([Windows Latest 2025-12-06](https://www.windowslatest.com/2025/12/06/discord-admits-its-windows-11-app-is-a-resource-hog-tests-auto-restart-when-ram-usage-exceeds-4gb))。TauriとElectronの比較では、6つのウィンドウで172MBと409MBを使用し、バンドルは8.6 MiBと244 MiBだった ([DEV/Hopp](https://dev.to/gethopp/tauri-vs-electron-performance-bundle-size-and-the-real-trade-offs-1el4))。起動時間に関する結果は測定方法によって異なる
- **7.4** アプリがバックグラウンドでOS全体を低速化させることはなく、バッテリーやファンの騒音、発熱にも影響しない
  - 根拠: macOS Tahoeでは、ElectronがプライベートAPIを使用したことでOS全体が低速化した（[9to5Mac 2025-10-11](https://9to5mac.com/2025/10/11/macos-26-tahoe-electron-gpu-slowdown-bug-fix-rollout/)）。macOSでは、App Napが前面にないアプリをスロットリングし、許容範囲を持つタイマーはグループ化される。これはアクティビティモニタの「エネルギー」タブに表示される（[エネルギー効率ガイド](https://developer.apple.com/library/archive/documentation/Performance/Conceptual/power_efficiency_guidelines_osx/)）。Windowsではウィンドウの状態に応じてQoSが変更され、最小化または完全に非表示のウィンドウはLowになる。バックグラウンド作業では、タスクマネージャの効率モードの葉のアイコンであるEcoQoS（`SetProcessInformation`）を有効にできる（[QoS](https://learn.microsoft.com/windows/win32/procthread/quality-of-service)）。Chromiumは、5分間非表示のページ上のタイマーを1分に1回に制限する。Tauriの`backgroundThrottling`はmacOS 14以降でのみ動作する
- **7.5** 非表示になっていたウィンドウは、開いた瞬間に新しいコンテンツが表示される
  - 根拠: WebViewは非表示ウィンドウのタイマーを制限する。Raycastはこれを無効化する
- **7.6** キャッシュが利用に合わせて増え続けることはない
  - 根拠: WebView2のユーザーデータフォルダは増え続ける。Microsoftは、アプリの実行中にフォルダを削除するよりも、ClearBrowsingData API（種類別または期間別）の使用を推奨している（[Learn](https://learn.microsoft.com/microsoft-edge/webview2/concepts/clear-browsing-data)）。Tauriには `clear_all_browsing_data` しかなく、すべてが削除される
- **7.7** アニメーションは控えめで「Reduce motion」に従っている
  - 根拠: [HIG: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- **7.8** Windowsでの追加ダウンロードは少ない
  - 根拠: TauriはWindowsの共有WebView2を使用している。これがないPCではオフラインインストーラーを同梱すると約127MB、固定版だと約180MB増える

## 8. アップデート

- **8.1** アプリはユーザーが作業中に再起動を強制しない。アップデートの準備が整ったことをユーザーに静かに通知し、ユーザーが選択すると再起動する
  - 根拠: Slackは再起動を強制せず、ヘルプアイコン（[Slack](https://slack.com/help/articles/360048367814)）にバッジを付ける。Signalはリストの上部にバナーを表示する。ユーザーからは、Cursor の更新の催促が強すぎるとの不満が出ている（[Cursor Forum 2026-08-17](https://forum.cursor.com/t/cursor-is-too-aggressive-with-updates/168602)）。Claude Desktopでは「9日間で9回の強制再起動」という報告がある
- **8.2** ユーザーは更新を手動に切り替えられる
  - 根拠: VS Code の `update.mode` ([VS Code](https://code.visualstudio.com/docs/enterprise/updates))
- **8.3** 新しいことを試してみたいユーザーは、安定版の隣にベータ版をインストールできる
  - 根拠: Zed、Signal、Figma、1Passwordには個別のチャンネルがある。SignalとFigmaのベータ版はデータを分け、並べてインストールする。Tauriのアップデーターにはチャンネル機能がないため、代わりにエンドポイントを分ける ([アップデーター](https://v2.tauri.app/plugin/updater/))
- **8.4** アップデートは全員に一度に送信されず、問題がある場合は停止・ロールバックできる
  - 根拠: VS Code は段階的にロールアウトする ([1.131](https://code.visualstudio.com/updates/v1_131))。Sparkle には 7 つのグループに分けて配る `phasedRolloutInterval`、スキップできない `criticalUpdate`、最低バージョン未満で確認を出す `minimumAutoupdateVersion` がある ([Sparkle](https://sparkle-project.org/documentation/publishing/))。electron-updater はインストールごとの ID で `stagingPercentage` を決定する。Tauri にはステージ済みロールアウトもデルタアップデートもない (#11863)。アップデートサーバーは ID でインストールを振り分けられ、`version_comparator` で前のバージョンに戻せる
- **8.5** 更新が失敗しない
  - 根拠: Restart Manager への切り替え後、Tauri の NSIS 更新は「`Failed to kill <App>`」で中断される ([#16277](https://github.com/tauri-apps/tauri/issues/16277), 2026-10)。更新の署名鍵を失うと、既存のインストールでは更新を検証できない
- **8.6** ユーザーはアップデートの内容を確認できるが、リリースのたびにプッシュされるわけではない
  - 根拠: VS Codeはアップデート後にリリースノートを開き、1.75以降はこれを停止する設定があり、1.81以降ではアップデート前に内容を確認できる（[1.75](https://code.visualstudio.com/updates/v1_75), [1.81](https://code.visualstudio.com/updates/v1_81)）。NN/gは、リリース時に表示される「新機能」リストが忘れられていると述べている（[NN/g](https://www.nngroup.com/articles/onboarding-tutorials/)）
- **8.7** 更新メッセージは正確である
  - 根拠: Mullvadは「サポート対象外」と誤って表示し、謝罪した ([Mullvad 2025-06-05](https://mullvad.net/en/blog/2025/6/5/erroneous-warning-about-desktop-app-not-being-supported))
- **8.8** 更新ファイルは改ざんされていない
  - 根拠: Tauriのアップデーターは署名が必要で、オフにできない

## 9. OSに馴染む

### メニュー

- **9.1** macOSでは標準順にメニューバーがあり、カスタムアクションもメニュー内にあり、利用できない項目は非表示ではなく無効化されている
  - 根拠: 順序はアプリ名、ファイル、編集、書式、表示、カスタムメニュー、ウィンドウ、ヘルプ。アプリメニューは About、設定… (⌘,)、サービス、隠す、ほかを隠す、すべてを表示、終了の順。ウィンドウメニューはウィンドウが1つでも最小化や拡大がある。ヘルプがヘルプブック形式のときは検索欄が自動で追加され、リリースノートなどの項目は区切り線の後に来る ([HIG: メニューバー](https://developer.apple.com/design/human-interface-guidelines/the-menu-bar), 2025-06-09)
- **9.2** Cmd+C、Cmd+V、Cmd+Zはカスタムメニューでも動作する
  - 根拠: 編集メニューがないとコピー＆ペーストが動作しない ([tauri #1055](https://github.com/tauri-apps/tauri/issues/1055))
- **9.3** メニューアイコンが消えない
  - 根拠: macOS 27 では NSMenu 内のシンボル画像が非表示になり、27 SDK でビルドすると他の画像も非表示になる。`NSMenuItem.preferredImageVisibility` を使用して保持する（macOS 27 リリースノート）
- **9.4** WindowsやLinuxでもあらゆる操作にアクセスできる
  - 根拠: TauriはWindowsやLinuxではメニューを追加しない

### 見た目と部品

- **9.5** アプリはOSのフォント、文字サイズ、アクセントカラー、ダークモードに、再起動せずに追従する
  - 根拠: [ToDesktop](https://www.todesktop.com/blog/posts/designing-desktop-apps-cross-platform-ux)、[Microsoft Learn](https://learn.microsoft.com/en-us/windows/apps/get-started/best-practices)。macOSはLiquid Glass、WindowsはFluent（Mica、Segoe UI Variable）を使用する。macOS 27では、Liquid Glassの透明度を変更できる（[Cult of Mac](https://www.cultofmac.com/news/liquid-glass-changes-ios-27-macos-27)）。Tauri 2.12.0はLiquid Glassを使用可能
- **9.6** 「開く」「保存」「確認」のダイアログは OS のものを使う
  - 根拠: [native-feel-skill](https://raw.githubusercontent.com/yetone/native-feel-skill/master/references/06-native-conventions.md)。macOS 27では、「開く」および「保存」パネルを「ウィンドウ」メニューから移動できる
- **9.7** 設定はCmd/Ctrl+, で別ウィンドウで開き、最後に表示したペインに戻る。アプリはOS 全体の設定の写しを独自に持たない
  - 根拠: [HIG: Settings](https://developer.apple.com/design/human-interface-guidelines/settings)。Zedは設定画面を別ウィンドウに配置し、JSONファイルを信頼できる唯一の情報源として保持した ([Zed 2025-12-12](https://zed.dev/blog/settings-ui))
- **9.8** スペルチェックと日付形式はOSの設定に従い、UIコントロールに赤い下線は引かれない
  - 根拠: ユーザーからは、Electronアプリが地域設定を無視しているとの不満が出ている ([mjtsai 2025-04-25](https://mjtsai.com/blog/2025/04/25/is-electron-really-that-bad))。WebView2はWindowsのスペルチェッカーを、WKWebViewはNSSpellCheckerを、WebKitGTKはEnchantを使用している。いずれも日本語辞書は確認されていない
- **9.9** 通知は控えめに使用し、OSの通知センターおよび通知設定に従う
  - 根拠: ストアポリシー 10.9. Tauriの通知はインストール済みアプリに限りWindowsで正しく表示され、アクションボタンはモバイルのみである ([通知](https://v2.tauri.app/plugin/notification/))
- **9.10** ステータスや通知を表示する必要がある場合にのみ、アプリがシステムトレイに留まる
  - 根拠: [詳細](https://learn.microsoft.com/windows/win32/shell/notification-area)。TauriトレイはLinuxではクリックイベントが発生しない
- **9.11** アプリが許可なくログイン時に起動登録をしない
  - 根拠: 旧認定要件 10.2. Tauriの自動起動にはバグがある。例えばWindowsでは1 回起動するとエントリが消える (#771)
- **9.12** タスクバーまたはDockには進捗や注意を引く表示が表示され、右クリックするとカスタムアクションが提供される
  - 根拠: Tauriには`setProgressBar`と`requestUserAttention`がある。ジャンプリストやDockメニュー用のAPIはない (#9916, #14460, #14699)

### ファイルとほかのアプリとの連携

- **9.13** ファイルをダブルクリックするとアプリ内でファイルが開き、既存のウィンドウに届く
  - 根拠: Tauri の `bundle.fileAssociations` には拡張子、UTI、MIMEタイプなどが含まれているが、タイプごとのドキュメントアイコン用のフィールドはない。開いたファイルは `RunEvent::Opened` ([config](https://v2.tauri.app/reference/config/)) として届く。Windows および Linux では、ファイル関連付けが `onOpenUrl` に到達せず（plugins-workspace #1990）、2つ目のウィンドウが開くか、あるいは何も起こらない
- **9.14** リンクでアプリを開く
  - 根拠: single-instance の `deep-link` 機能がないため、Windows と Linux では deep-link プラグインがリンクごとに新しいプロセスを開始する。Linux の `.desktop` の `Exec` 行に `%u` がないため、URL は暗黙的に破棄される (#15928)
- **9.15** OSの「最近使った項目」やジャンプリストに最近使った項目が表示される
  - 根拠: [Electron recent documents](https://www.electronjs.org/docs/latest/tutorial/recent-documents)
- **9.16** コピーしたコンテンツは、書式付きで他のアプリに貼り付け可能
  - 根拠: Tauriのクリップボードプラグインには`writeHtml`（HTMLとプレーンテキストの組み合わせ）はあるが、`readHtml`はなく、画像やRTFはドキュメントに記載されている範囲のみ
- **9.17** ユーザーはシェアシートを通じてコンテンツを送信できる
  - 根拠: Tauriには公式のシェアプラグインがない（サードパーティ製の選択肢としてtauri-plugin-sharekit 0.3.1がある）
- **9.18** Finder と Explorer はプレビューを表示し、Spotlight と Windows Search で中身を検索できる
  - 根拠: macOS 15 では従来の `.qlgenerator` プラグインが削除されたため、`QLPreviewingController` などのアプリ拡張機能が必要になる ([Eclectic Light 2024-10-31](https://eclecticlight.co/2024/10/31/how-sequoia-has-changed-quicklook-and-its-thumbnails/))。Spotlight には依然として `.mdimporter` が必要だ ([CSImportExtension](https://developer.apple.com/documentation/corespotlight/csimportextension) は macOS では何も行わない)。Windows にはプレビューハンドラと IFilter が必要だ。Tauri はこれらを一切ビルドしない
- **9.19** 印刷およびPDFエクスポートはOSの規約に従う
  - 根拠: HIGでは、通常の場所に印刷を配置し、印刷する内容がない場合は「ファイル」＞「印刷」を無効にするよう指示している。アプリ固有のオプションは印刷パネル（[印刷](https://developer.apple.com/design/human-interface-guidelines/printing)）内にある。Tauri 2.12.5では `webview.print()` のみが有効で、PDFエクスポート、サイレント印刷、またはプリンター選択用のAPIはない。macOSでは `window.print` を置き換えることで動作し、iframeを印刷しても何も起こらない (#13451)

## 10. 言語と地域

- **10.1** アプリはOSの言語に従い、アプリごとに言語を変更できる
  - 根拠: macOSでは、「システム設定」でアプリごとに言語を選択でき、アプリに標準搭載されている言語のみが表示される。Appleは、アプリ内の言語切り替えでその設定に遷移することを推奨している ([WWDC19 403](https://developer.apple.com/videos/play/wwdc2019/403/), [9to5Mac 2026-08-13](https://9to5mac.com/2026/08/13/psa-setting-different-default-languages-in-different-mac-apps/))。Windowsには `PrimaryLanguageOverride` があり、変更には再起動が必要な場合が多い ([Learn](https://learn.microsoft.com/windows/apps/design/globalizing/manage-language-and-region))
- **10.2** ユーザーは自身の言語でアプリを利用できる
  - 根拠: CSA Research（2020年、29カ国、8,709人）では、76%が自身の言語の製品を好み、日本、韓国、中国、台湾では90%を超える割合となった（[CSA](https://csa-research.com/blogs-events/csa-in-the-media/press-releases/consumers-prefer-their-own-language)）。Flathubは英語のUIを必要とする
- **10.3** 翻訳文は長くても切れていない
  - 根拠: 「cut and paste」は英語で13文字、ドイツ語で25文字。Microsoftは擬似ローカライズ（qps-ploc、右から左は qps-plocm、東アジアは qps-ploca）でのテストを推奨している（[Learn](https://learn.microsoft.com/globalization/methodology/pseudolocalization)）
- **10.4** 右から左の言語ではレイアウトを反転させる
  - 根拠: 左・右ではなく先頭と末尾を使用し、数字やラテン文字は左から右へ配置し、一部のアイコンは反転させない ([HIG: Right to left](https://developer.apple.com/design/human-interface-guidelines/right-to-left))
- **10.5** ショートカットとアクセスキーは言語に適合している
  - 根拠: 第9章
- **10.6** インストーラーがユーザーの言語で表示される
  - 根拠: Tauri の NSIS は言語セレクタを表示でき、WiX/MSI は en-US がデフォルトとなる。Tauri には i18n システムがなく、`locale()` に `zh-Hans-CN` のようなスクリプトサブタグを含めることができる ([os-info](https://v2.tauri.app/plugin/os-info/), [Windows installer](https://v2.tauri.app/distribute/windows-installer/))

## 11. エラー、ヘルプ、初回の体験

- **11.1** エラーは、何が起きたか、なぜか、どうすればよいかを、具体的に、利用者を責めずに伝える
  - 根拠: HIGは、「Error」や「Error 329347」といったタイトルは避け、何が起きたのか、どのような文脈で起こったのかを明記するよう求めている。また、ボタンには動詞を1〜2個使い、取り消し可能な一般的な操作については警告しないようにとも書いてある。Esc と Cmd-. でアラートを閉じられる（[Alerts](https://developer.apple.com/design/human-interface-guidelines/alerts)）。Microsoftは、問題、原因、解決策を明記し、「不明なエラー」を避けるよう求めている。また、詳細は折りたたみの中に置き、エラーコードは解決策と併せてのみ表示し、ユーザーの誤入力を消去しないよう求めている（[エラーメッセージ](https://learn.microsoft.com/windows/win32/uxguide/mess-error), 2025-07-24）。Fluent 2では、行き詰まりがないように、少なくとも2つの次のステップを提示することになっている
- **11.2** アラートダイアログではなくその場にエラーが表示される
  - 根拠: HIG は対象項目の近くにステータスを表示するよう指示している（[フィードバック](https://developer.apple.com/design/human-interface-guidelines/feedback)）。GNOME はエラーダイアログを避け、軽微なエラーにはトーストを、オフラインや読み取り専用などの永続的な状態にはバナーを使用している（[ダイアログ](https://developer.gnome.org/hig/patterns/feedback/dialogs.html)、[バナー](https://developer.gnome.org/hig/patterns/feedback/banners.html)）
- **11.3** アプリが依存する外部プログラムが欠けている場合、ユーザーは何が欠けているか、どうやってインストールするか、アプリにその場所をどう教えるかを確認できる
  - 根拠: VS Codeは「Git not found. Install it or configure it using the 'git.path' setting」と表示し、試したパスを出力に記述する ([VS Code](https://code.visualstudio.com/docs/sourcecontrol/troubleshooting))
- **11.4** クラッシュレポートはユーザーが同意した場合にのみ送信され、ユーザーは送信内容を確認できる
  - 根拠: Firefoxは未送信のクラッシュレポートを自動的に送信しない（[Mozilla](https://support.mozilla.org/kb/unsent-crash-reports-in-firefox)）。Sentryの外部クラッシュ報告機能では、送信するかどうかを選択でき、何を行っていたかを記述するフィールドが用意されている（[Sentry](https://docs.sentry.io/platforms/native/advanced-usage/external-crash-reporter/)）
- **11.5** バグ報告時には、バージョン、環境、ログがまとめて収集される
  - 根拠: VS Codeの「問題の報告」は、バージョン、拡張機能、環境を入力し、重複箇所を検索する。Zedにはシステム仕様のコピー、ログのオープン、バグ報告テンプレートの入力といったコマンドがあり、ログからシークレットを削除するようユーザーに求めている ([Zed](https://zed.dev/docs/troubleshooting))
- **11.6** ヘルプは今の作業に合い、簡単に閉じられる
  - 根拠: HIG はヒントを3ステップ以下の機能に限定し、宣伝なしで1〜2文にとどめ、ユーザーが既に使用している機能には表示せず、最大でも24時間に1回程度表示する。ツールチップは動詞で始まり、60〜75文字以内に収まる ([ヘルプの提供](https://developer.apple.com/design/human-interface-guidelines/offering-help))
- **11.7** 空の画面には、現在の状態と次の操作が表示されている
  - 根拠: GNOMEでは、避けられない初回実行時の空の表示にのみイラストを使用し、空のフォルダや検索結果がゼロの場合にはシンプルな記号を使用する。それぞれに、状態と次のステップを示す見出しがある ([Placeholder pages](https://developer.gnome.org/hig/patterns/feedback/placeholders.html))
- **11.8** 必要に応じて権限を要求し、OSプロンプト前の画面には「続行」ボタンのみがある
  - 根拠: HIGはOSプロンプト前の画面を「続行」または「次へ」ボタン1つに限定し、それ以外の操作を操作的なものとして扱う。理由のテキストは特定の一文であるべき ([プライバシー](https://developer.apple.com/design/human-interface-guidelines/privacy))

## 12. アプリ内のAI

- **12.1** AI出力の破棄、元に戻す、再試行、編集の操作は出力の横に表示され、取り消せない操作は確認される
  - 根拠: HIG ([Generative AI](https://developer.apple.com/design/human-interface-guidelines/generative-ai), 2026-06-08更新). Microsoft の Human-AI Interaction の 18 のガイドライン（G7〜G9） ([HAX](https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/)). Fluent 2 では、エージェントの操作は実行前に承認を受ける ([Responsible AI](https://fluent2.microsoft.design/responsible-AI/))
- **12.2** ユーザーはAIの変更を一括ではなく部分的にレビューし、その都度保持または破棄する
  - 根拠: VS Code Copilotは、ファイル単位またはハンク単位で選択可能な「保持」または「元に戻す」まで、編集を保留状態にする。デフォルトでは、各リクエストの前にチェックポイントが取得される（[VS Code](https://code.visualstudio.com/docs/copilot/chat/review-code-edits)）。Zedはハンク単位での受け入れも可能で、中断した実行後でも「チェックポイントの復元」が表示される（[Zed](https://zed.dev/docs/ai/agent-panel)）。Notionは、ユーザーがプランページを承認した後にのみ動作する（[Notion](https://www.notion.com/help/review-and-approve-plans-before-notion-ai-runs)）
- **12.3** 「Undo」は本当に元に戻す
  - 根拠: Cursorのチェックポイント復元は2026年に入っても何も起こらず、ユーザーはエージェントが実行する前にコミットすることで身を守っているとの報告（[Cursor Forum](https://forum.cursor.com/t/checkpoints-are-still-broken/169425)）
- **12.4** ユーザーはAIがどこで使用されているかを確認でき、AIが人間として提示されることはなく、AIが誤っている可能性やその限界についても把握できる
  - 根拠: HIG. Fluent 2では、AIに人間の名前や顔を与えないよう指示している。BBCからの苦情を受け、Appleは通知サマリーを一時停止し、残りの部分を斜体で表記してベータ版とラベル付けした ([MacRumors 2025-01-16](https://www.macrumors.com/2025/01/16/ios-18-3-news-notifications-removed/))。EU AI法第50条の透明性に関する義務は、2026-08-02から適用される。欧州委員会はAIアイコンを公開したが、アイコンだけでは不十分であり、テキストを添える必要があるとした（二次資料：[Smashing Magazine 2026-08](https://smashingmagazine.com/2026/08/eu-guidelines-ai-labelling/))
- **12.5** ユーザーは外部に送信される内容や、それが保存または学習に使用されるかを確認できる。モデルがローカルで動作する場合、デバイスからは何も送信されない
  - 根拠: HIGは、どのデータが送信され、それが保存または学習に使用されるかを示し、個人データの許可を求めるよう指示している。Raycastは学習にデータを使用せず、BYOKキーをデバイスに保持し、Ollama ([Raycast](https://manual.raycast.com/ai/raycast-ai-privacy-security)) では何も送信しない
- **12.6** 待機中、ユーザーはAIが具体的に何を行っているかを確認できる
  - 根拠: HIGでは、「Processing…」ではなく「Summarizing key themes from your notes」と記載するよう求めている。最初のトークン化やジッターまでの時間に関する指標は、実務者のブログにのみ存在する
- **12.7** 失敗や拒否時に、ユーザーは次に何をすべきか分かっており、AIなしでアプリを利用できる
  - 根拠: HIGは平易な表現と次のステップ、そしてAIを使わないフォールバックを求める
- **12.8** AIを完全にオフにできる
  - 根拠: Zedの`disable_ai`はすべてのAIエントリポイントを削除する([Zed 2025-07-23](https://zed.dev/blog/disable-ai-features))。VS Codeはアンインストール後もCopilotボタンが残ったため批判された([The Register 2025-09-05](https://www.theregister.com/software/2025/09/05/github-copilot-on-autopilot-as-community-complaints-persist/599985))
- **12.9** ユーザーが突然上限やコストに達することはない
  - 根拠: Copilotは上限に達した後、静かにベースモデルへフォールバックしていた。2026-06-01にAIクレジットに移行し、2026-07-20から利用が確認されている（[GitHub](https://github.blog/changelog/2026-07-20-copilot-users-can-now-see-ai-credits-used-per-billing-cycle)）。Cursorは2025-06の価格変更後、謝罪し返金を行った（[TechCrunch](https://techcrunch.com/2025/07/07/cursor-apologizes-for-unclear-pricing-changes-that-upset-users/)）
- **12.10** フィードバックは任意であり、作業を妨げない
  - 根拠: HIG, Fluent 2 (カテゴリ: 不正確、不完全、偏向、有害; 出典へのディープリンク)

## 13. 閉じる、終了する、削除する

- **13.1** macOSでは、最後のウィンドウが閉じた後もアプリが起動したままになり、ウィンドウがDockから戻ってくる。WindowsおよびLinuxでは、最後のウィンドウを閉じるとアプリが終了する
  - 根拠: [Electron macOS Dock](https://www.electronjs.org/docs/latest/tutorial/macos-dock), [tyler.io](https://tyler.io/2021/03/20/mortal-mac-app-sins/)
- **13.2** 作業が失われるときだけ終了の確認が出る
  - 根拠: [native-feel-skill](https://raw.githubusercontent.com/yetone/native-feel-skill/master/references/06-native-conventions.md)
- **13.3** 終了後にプロセスが残らず、OSシャットダウン時やユーザーログオフ時にアプリが素早く応答する
  - 根拠: 旧認定要件では、アプリが30秒以内に `WM_ENDSESSION` に応答することが求められていた。ストアではクリーンな終了が求められる (10.4.2)
- **13.4** アンインストールしても痕跡が残らず、ユーザーはデータの保持か削除かを選択できる
  - 根拠: 残骸の削除には専用ツールが必要だとユーザーが不満を漏らす（[Adobe Community](https://community.adobe.com/questions-617/creative-cloud-many-files-left-despite-uninstallation-566070)、[Microsoft Tech Community](https://techcommunity.microsoft.com/discussions/windows11/files-left-behind-after-uninstalling-windows-11-applications-require-cleaning-up/4498407)）。「アプリと機能」に名称、発行元、場所、バージョンを登録する（旧認定要件5.5および5.6）。wingetは残骸を残すインストーラーを失敗する

## 14. 誰でも使える

- **14.1** すべてのコントロールに名前があり、フォーカスが表示可能で、アプリはNVDA、Narrator、VoiceOverに対応している
  - 根拠: VS Codeはテスト対象となったスクリーンリーダーを明記し、いずれかを検出すると専用モードに切り替わる（[VS Code](https://code.visualstudio.com/docs/configure/accessibility/accessibility)）。Claude Desktopは名前のないアイコンボタンが22個あったと報告されている。Windowsは名前とタブ順の指定を求め、Narratorで確認を行い、深刻なリグレッションが発生した際にリリースを停止するCIでの自動チェックを推奨している（[アクセシビリティチェックリスト](https://learn.microsoft.com/en-us/windows/apps/design/accessibility/accessibility-checklist), 2026-07-22）
- **14.2** 文字を大きくし、コントラストを高くしてもレイアウトが崩れず、色だけで情報が表示されない
  - 根拠: [HIG: アクセシビリティ](https://developer.apple.com/design/human-interface-guidelines/accessibility)、Windows チェックリスト（文字のコントラスト 4.5:1 以上、高コントラストテーマ、拡大鏡）、[GNOME HIG](https://developer.gnome.org/hig/guidelines/accessibility.html)、[KDE HIG](https://develop.kde.org/hig/accessibility/)
- **14.3** 高速移動や点滅はなく、アプリが設定に従って動きを抑える
  - 根拠: HIG
- **14.4** Linux でもスクリーンリーダーが内容を確認できる
  - 根拠: WebKitGTK はウェブコンテンツを AT-SPI に公開していないため、スクリーンリーダーでは確認できない（WebKit バグ 287517; 修正が検討中とのこと。[agent-desktop #446](https://github.com/vercel-labs/agent-desktop/issues/446)）

## 15. 信頼と安全

- **15.1** ネットワークなしですべて動作し、ローカルデータが正準な情報源となる
  - 根拠: Obsidianはネットワークなしで完全に動作し、同期を任意としている点が評価されている。Linearはオフラインモードを「緊急時用であり、完全な機能ではない」としている（[Linear](https://linear.app/docs/offline-mode)）
- **15.2** 利用データが送信されない、あるいは明示的な同意がある場合にのみ送信され、ユーザーは何が送信されたかを確認できる
  - 根拠: Mockoonは利用データの送信を停止した。送信することで、以前の「送信しない」という選択がキャンセルされる仕組みは特に敬遠されている ([Mockoon 2026-05-06](https://mockoon.com/blog/telemetry-removed-desktop-web-app/))。VS Codeでは、送信レベルを選択して、その場で何が送信されたかを確認できる ([VS Code telemetry](https://code.visualstudio.com/docs/configure/telemetry))
- **15.3** 規約は分かりやすく、ユーザーが作ったものへの権利を主張するものではない
  - 根拠: Firefoxは規約の文言を巡って反発を受け、約1週間で書き直した ([TechCrunch 2025-03-03](https://techcrunch.com/2025/03/03/mozilla-rewrites-firefoxs-terms-of-use-after-user-backlash/))
- **15.4** ユーザーが購入したものが後から動作しなくなることはない
  - 根拠: Topaz Labsは永久ライセンスを終了したことで反発を招いた ([CG Channel 2025-09-30](https://cgchannel.com/2025/09/topaz-labs-to-end-perpetual-licenses-of-its-software))
- **15.5** パスワードとトークンはディスクにプレーンテキストで残されない
  - 根拠: macOS には Keychain がある。Windows には DPAPI と Credential Locker がある（同じユーザーの他のアプリが読み取れる点に注意。[Learn](https://learn.microsoft.com/en-us/windows/apps/develop/security/credential-locker), 2026-07）。Linux には Secret Service がある。Electron の `safeStorage` は、キーリングがない場合に Linux では固定キーにフォールバックする ([Electron](https://www.electronjs.org/docs/latest/api/safe-storage))。Tauri の stronghold プラグインは v3 で削除される予定であり（[discussion #7846](https://github.com/orgs/tauri-apps/discussions/7846)）、公式のキーリングプラグインは存在しないため、通常は `keyring` クレート 4.2.0 が選ばれる
- **15.6** 他のアプリやウェブページが、デバイス上でアプリが起動するサーバーにアクセスできない
  - 根拠: ループバックでのみ待機し、トークンで認証する
- **15.7** 画面が呼び出せるアクションが最小限で、画面が読み込むものが制限されている
  - 根拠: Tauri は機能と CSP ([Security](https://v2.tauri.app/security/)) で制限している。バージョン 2.12.0 はチャネル IPC を作成元のウィンドウに紐付け (GHSA-w28w-mhc8-qvjv) し、リモートオリジンからの IPC にも ACL を適用する。Safari 27 は同一ページ内のナビゲーションに CSP を適用する
- **15.8** アプリが他のアプリのデータや機密フォルダに密かにアクセスすることはない
  - 根拠: macOS 27はデフォルトで他の開発者のアプリデータコンテナへのアクセスを拒否しており、ユーザーはプライバシーとセキュリティでアクセスを管理できる。Appleは、フルディスクアクセスは明示的なユーザー操作があった場合にのみ許可されると発表し、その理由としてAIエージェントを挙げた（[Apple 2026-10-02](https://developer.apple.com/news/)）。macOS 27.3 betaにはフォルダごとの権限が設定されているが、まだ有効になっていない（[9to5Mac 2026-11-08](https://9to5mac.com/2026/11/08/macos-changes-for-full-disk-access-ai-agents-imessage/)）。Windowsはパッケージ化されていないデスクトップアプリのカメラ、マイク、および位置情報の権限をテスト中である（Insider）
- **15.9** ユーザーは取得したファイルが本物であることを確認し、中身を確認できる
  - 根拠: `cargo-cyclonedx` と cdxgen で SBOM を作成してマージし、`cargo auditable` で依存関係リストをバイナリに埋め込む。GitHub のアーティファクト証明（`actions/attest`）があれば、ユーザーは `gh attestation verify` ([GitHub Docs](https://docs.github.com/actions/security-guides/using-artifact-attestations-to-establish-provenance-for-builds)) で確認できる。Tauri は再現可能なビルドをサポートしていない ([#13612](https://github.com/tauri-apps/tauri/issues/13612))
- **15.10** フレームワークやWebViewの修正が素早く届く
  - 根拠: TauriはOSのWebViewを使うため、OSがWebViewの修正を配信する。WebView2はバージョン152から2週間ごとにリリースされるようになった([Edge Blog 2026-08-24](https://blogs.windows.com/msedgedev/2026/08/24/webview2-is-moving-to-a-2-week-release-cadence/))

## 16. 複数のデバイスと管理環境

- **16.1** ユーザーが新しいPCに移動すると設定やデータが移行される
  - 根拠: 移行アシスタントはアプリ、アカウント、設定を移行するが、ネットワークパスワードは移行しない（[Apple](https://support.apple.com/102613)）。Windows Backupはストアアプリのみを復元し、他のアプリについてはユーザーをウェブに誘導し、アプリデータはOneDriveフォルダにある場合のみ移行する（[Microsoft](https://support.microsoft.com/windows/back-up-and-restore-with-windows-backup-87a81f8a-78fa-456e-b521-ac0560e32338)）
- **16.2** 1台のPCの複数のユーザーが互いの邪魔をしない
  - 根拠: Tauriのシングルインスタンスプラグインはユーザーセッションごとに動作する。NSISはデフォルトでユーザーごとにインストールされる
- **16.3** ユーザーはアプリをUSBドライブに入れてどこへでも持ち運べる
  - 根拠: VS Codeはexeの隣に`data`フォルダがあることでポータブルになる（macOSではアプリを隔離していると動作しない）([VS Code](https://code.visualstudio.com/docs/editor/portable))。Tauriにはポータブルモードがない
- **16.4** アプリは社内プロキシで動作する
  - 根拠: ChromiumベースのアプリはPACファイル自体を評価する。Tauriの`proxy_url`は`http://`と`socks5://`のみを受け付け、PACも認証もなく、wryにはプロキシ認証用のフックがない。reqwestはOSのプロキシ設定を読み取るがPACは読み取らない
- **16.5** 会社が TLS を検査する接続が動作する
  - 根拠: WebView は OS 証明書ストアを使用する。tauri-plugin-http はデフォルトで同梱のルート証明書を使用し、会社のルート証明書では失敗する ([features](https://docs.rs/crate/tauri-plugin-http/2.5.8/features))。Node も 22.19 と 24.6 で `--use-system-ca` を追加した
- **16.6** 管理者は設定を一元的に適用できる
  - 根拠: VS Code には ADMX/ADML テンプレート、macOS の設定プロファイル、Linux の JSON ポリシーファイルがあり、マシンポリシーはユーザー設定よりも優先される ([VS Code](https://code.visualstudio.com/docs/enterprise/policies))。Tauri にはポリシーシステムがない
- **16.7** 管理者権限やネットワークなしでアプリをインストールする
  - 根拠: NSISはデフォルトでユーザーごと（`%LOCALAPPDATA%`）にインストールされる。WebView2 の入れ方は、既定（ネットワークが必要）、+1.8 MB、+127 MB、+180 MB の 4 通りである（[Windowsインストーラー](https://v2.tauri.app/distribute/windows-installer/)）
