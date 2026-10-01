'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Check, ChevronRight, Clock3, Code2, Flame, GraduationCap, History, Menu, RotateCcw, Sparkles, Trophy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

type Era = { id: string; years: string; label: string; short: string; title: string; description: string; why: string; code: string; features: string[]; color: string };

const eras: Era[] = [
  { id:'birth', years:'1995–1999', label:'誕生と標準化', short:'ES1–ES3', title:'10日間の試作から、Webの共通語へ', description:'1995年、Brendan EichがNetscapeでMochaを試作。LiveScriptを経てJavaScriptとなり、ブラウザ間の互換性を守るためEcmaで標準化されました。1997年のECMAScript 1が最初の共通仕様です。', why:'NetscapeのJavaScriptとMicrosoftのJScriptが分岐し始め、Web作者が同じコードを複数ブラウザで動かすための共通仕様が必要でした。', code:`// ES1でも通じる、初期の書き方\nvar message = "Hello, Web!";\n\nfunction greet(name) {\n  return message + " " + name;\n}\n\ngreet("Netscape");`, features:['var と関数','プロトタイプ','正規表現（ES3）','try / catch（ES3）'], color:'#f0b429' },
  { id:'lost', years:'2000–2009', label:'停滞と再出発', short:'ES4 → ES5', title:'「大きく変える」より、合意して前へ', description:'野心的なES4は複雑さと互換性をめぐる対立で公開に至りませんでした。Ajaxの普及でJavaScriptが再注目され、2009年のES5は既存言語を着実に改善しました。', why:'後方互換性を守りながら進化させるという、現在まで続くJavaScript設計の原則が形づくられた時代です。', code:`"use strict";\n\nvar scores = [72, 91, 88];\nvar passed = scores\n  .filter(function (score) {\n    return score >= 80;\n  });`, features:['strict mode','JSON','Arrayメソッド','Object.create'], color:'#f97355' },
  { id:'modern', years:'2010–2015', label:'モダンJSの誕生', short:'ES6 / ES2015', title:'アプリケーションを書く言語へ', description:'Node.js、npm、SPAの成長を背景に、2015年の第6版は過去最大級の更新となりました。以後は版番号ではなく年号で呼び、毎年リリースする方式へ移行します。', why:'大規模なコードを安全に分割し、非同期処理やデータ操作を読みやすく書くための言語機能が必要でした。', code:`const learners = ["Aki", "Mina"];\n\nconst greetings = learners.map(\n  name => \`Hello, \${name}!\`\n);\n\nexport class Course {\n  constructor(title) {\n    this.title = title;\n  }\n}`, features:['let / const','アロー関数','class','Promise','module'], color:'#a3d95b' },
  { id:'annual', years:'2016–2020', label:'毎年の進化', short:'ES2016–2020', title:'小さく、予測可能に届ける', description:'TC39の段階的な提案プロセスと年次リリースが定着。async/await、object rest/spread、optional chainingなど、日常の開発を変える機能が着実に追加されました。', why:'巨大リリースを長年待つのではなく、実装・テスト・合意が揃った機能を毎年安全に届けるためです。', code:`async function loadUser(id) {\n  const response = await fetch(\`/users/\${id}\`);\n  const user = await response.json();\n  return user.profile?.displayName ?? "Guest";\n}`, features:['async / await','Object spread','BigInt','?. と ??'], color:'#52c7b8' },
  { id:'today', years:'2021–2026', label:'現在のECMAScript', short:'ES2021–2026', title:'成熟した言語は、道具を磨き続ける', description:'private fields、top-level await、変更しない配列メソッド、Iterator helpersなどが追加。ES2026は第17版として、Array.fromAsync、Iterator.concat、Math.sumPreciseなどを収録しました。', why:'既存の巨大なエコシステムを壊さず、非同期データ・イテレータ・バイナリなど現代の実務を標準機能で扱うためです。', code:`const total = Math.sumPrecise(\n  Iterator.concat([0.1, 0.2], [0.3])\n);\n\nconst rows = await Array.fromAsync(\n  streamOfRecords()\n);`, features:['private fields','top-level await','Iterator helpers','Array.fromAsync'], color:'#8aa6ff' },
];

const quiz = { question:'ES2015がJavaScript史の転換点と呼ばれる最大の理由は？', choices:['JavaScriptが初めてブラウザで動いたから','大規模開発向けの機能と年次リリースへの道筋が整ったから','ECMAScriptという名称が廃止されたから'], answer:1 };

export default function Home() {
  const [activeEra,setActiveEra]=useState(2); const [answer,setAnswer]=useState<number|null>(null); const [checked,setChecked]=useState(false); const [mobileNav,setMobileNav]=useState(false);
  const era=eras[activeEra]; const correct=checked&&answer===quiz.answer; const path=useMemo(()=>eras.map((_,i)=>i<=activeEra?1:0),[activeEra]);
  useEffect(() => {
    const context = (document as Document & { modelContext?: { registerTool: (tool: unknown, options?: { signal?: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const tool = {
      name: 'navigate_history_era',
      title: 'JavaScript史の時代を開く',
      description: '指定した時代の解説とコード例を画面に表示します。',
      inputSchema: { type: 'object', properties: { eraId: { type: 'string', enum: eras.map(item => item.id) } }, required: ['eraId'], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input: unknown) {
        const eraId = typeof input === 'object' && input !== null && 'eraId' in input ? (input as { eraId?: unknown }).eraId : undefined;
        const index = eras.findIndex(item => item.id === eraId);
        if (index < 0) throw new Error('Unknown eraId');
        setActiveEra(index);
        document.querySelector('#lesson')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return { eraId, title: eras[index].title, status: 'displayed' };
      },
    };
    try { void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => undefined); } catch { /* WebMCP is optional in unsupported browsers. */ }
    return () => lifecycle.abort();
  }, []);
  return <main className="min-h-screen bg-background text-foreground">
    <header className="topbar">
      <a className="brand" href="#top" aria-label="JS Chronicle ホーム"><span className="brand-mark">JS</span><span>JS Chronicle</span></a>
      <div className="topbar-center"><Badge className="edition-badge">ECMAScript 2026 対応</Badge><span className="save-state"><Check size={14}/> 学習状況を保存済み</span></div>
      <div className="topbar-actions"><div className="streak"><Flame size={16}/><b>7</b><span>日連続</span></div><button className="avatar" aria-label="プロフィール">YR</button><Button variant="ghost" size="icon" className="menu-button" onClick={()=>setMobileNav(!mobileNav)} aria-label="メニュー">{mobileNav?<X/>:<Menu/>}</Button></div>
    </header>
    <div className="app-shell" id="top">
      <aside className={`sidebar ${mobileNav?'sidebar-open':''}`}>
        <div className="progress-block"><div className="progress-label"><span>コース進捗</span><strong>18%</strong></div><Progress value={18} className="course-progress"/><small>2 / 11 チャプター完了</small></div>
        <nav aria-label="コース目次"><p className="nav-eyebrow">LEARNING PATH</p>
          <a className="nav-item active" href="#history" onClick={()=>setMobileNav(false)}><span className="nav-icon"><History/></span><span><b>JavaScriptの歴史</b><small>いまここ</small></span><ChevronRight/></a>
          <a className="nav-item" href="#lesson" onClick={()=>setMobileNav(false)}><span className="nav-icon"><Code2/></span><span><b>言語の基礎</b><small>8 レッスン</small></span><ChevronRight/></a>
          <a className="nav-item" href="#quiz" onClick={()=>setMobileNav(false)}><span className="nav-icon"><GraduationCap/></span><span><b>確認テスト</b><small>3 問</small></span><ChevronRight/></a>
        </nav>
        <div className="sidebar-card"><Trophy/><p><b>歴史を知ると、仕様が読める。</b></p><small>「なぜ？」から学ぶと、暗記せずに使い分けられます。</small></div>
      </aside>
      <section className="content">
        <div className="lesson-heading"><div><p className="kicker"><span>CHAPTER 01</span><span className="kicker-line"/>約25分</p><h1>JavaScriptは、<br/><em>なぜ今の形になったのか。</em></h1><p className="intro">誕生からECMAScript 2026まで。コードの変化を、Webの歴史と一緒にたどります。</p></div><div className="chapter-number" aria-hidden="true">01</div></div>
        <section className="timeline-card" id="history" aria-labelledby="timeline-title">
          <div className="section-title-row"><div><p className="section-kicker"><Sparkles size={14}/> INTERACTIVE TIMELINE</p><h2 id="timeline-title">30年の進化を、一枚で。</h2></div><div className="timeline-legend"><span className="legend-dot"/> 主要な転換点を選択</div></div>
          <div className="history-graph" role="group" aria-label="ECMAScriptの歴史グラフ"><div className="graph-axis"><span>言語への影響</span><b>高</b><b>低</b></div>
            <svg className="graph-line" viewBox="0 0 1000 220" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f0b429" stopOpacity=".22"/><stop offset="100%" stopColor="#f0b429" stopOpacity="0"/></linearGradient></defs><path className="area" d="M40 126 C120 86 130 92 210 142 S310 170 400 46 S530 112 605 98 S735 86 790 75 S900 78 960 50 L960 200 L40 200 Z"/><path className="line" d="M40 126 C120 86 130 92 210 142 S310 170 400 46 S530 112 605 98 S735 86 790 75 S900 78 960 50"/></svg>
            <div className="graph-points">{eras.map((item,index)=><button key={item.id} className={`graph-point point-${index} ${activeEra===index?'selected':''}`} style={{'--era-color':item.color} as React.CSSProperties} onClick={()=>setActiveEra(index)} aria-pressed={activeEra===index}><span className="point-ring"><span/></span><b>{item.short}</b><small>{item.years}</small></button>)}</div>
            <div className="graph-years"><span>1995</span><span>2000</span><span>2005</span><span>2010</span><span>2015</span><span>2020</span><span>2026</span></div>
          </div>
        </section>
        <section className="era-detail" id="lesson" aria-live="polite"><div className="era-copy"><div className="era-meta"><Badge className="era-badge" style={{backgroundColor:era.color}}>{era.years}</Badge><span>{era.label}</span></div><h2>{era.title}</h2><p className="era-description">{era.description}</p><div className="why-box"><span className="why-icon">?</span><div><b>なぜ、この変化が必要だった？</b><p>{era.why}</p></div></div><div className="features">{era.features.map(feature=><span key={feature}><Check size={13}/>{feature}</span>)}</div></div>
          <div className="code-panel"><div className="code-head"><span><i className="red"/><i className="yellow"/><i className="green"/></span><b>{era.short.toLowerCase().replace(' / ','-')}.js</b></div><pre><code>{era.code}</code></pre><div className="code-caption"><Code2 size={15}/> 各時代の書き方を比較してみよう</div></div></section>
        <div className="era-switcher" aria-label="時代を切り替える">{eras.map((item,index)=><button key={item.id} onClick={()=>setActiveEra(index)} className={activeEra===index?'active':''}><span className={path[index]?'done':''}>{index<activeEra?<Check/>:index+1}</span><b>{item.short}</b></button>)}</div>
        <section className="quiz-card" id="quiz"><div className="quiz-top"><div><p className="section-kicker"><GraduationCap size={15}/> CHECKPOINT</p><h2>理解度をチェック</h2></div><span className="quiz-count">1 / 3</span></div><p className="question">{quiz.question}</p>
          <div className="choices">{quiz.choices.map((choice,index)=>{const revealCorrect=checked&&index===quiz.answer;const revealWrong=checked&&answer===index&&index!==quiz.answer;return <button key={choice} className={`${answer===index?'selected':''} ${revealCorrect?'correct':''} ${revealWrong?'wrong':''}`} onClick={()=>{setAnswer(index);setChecked(false)}}><span>{String.fromCharCode(65+index)}</span>{choice}{revealCorrect&&<Check className="choice-result"/>}{revealWrong&&<X className="choice-result"/>}</button>})}</div>
          {checked&&<div className={`feedback ${correct?'success':'retry'}`}>{correct?<Check/>:<RotateCcw/>}<p><b>{correct?'正解です！':'もう一度考えてみよう'}</b><span>{correct?'ES2015はモジュール、class、Promiseなどを導入し、年次リリースへの転換点になりました。':'ヒント：言語機能だけでなく、その後のリリース方法にも注目してください。'}</span></p></div>}
          <div className="quiz-actions"><span><Clock3 size={15}/> 目安 1分</span><Button onClick={()=>setChecked(true)} disabled={answer===null} className="check-button">答えを確認 <ArrowRight/></Button></div>
        </section>
        <section className="next-card"><div className="next-icon"><BookOpen/></div><div><small>NEXT CHAPTER</small><h2>値・型・変数：すべてのコードの出発点</h2><p>varからlet / constへ。歴史を知った今なら、使い分けの理由が見えてきます。</p></div><Button variant="outline">次へ進む <ArrowRight/></Button></section>
        <footer><span>JS Chronicle</span><p>参照：<a href="https://tc39.es/ecma262/" target="_blank" rel="noreferrer">TC39 最新仕様</a>・<a href="https://ecma-international.org/publications-and-standards/standards/ecma-262/" target="_blank" rel="noreferrer">Ecma International</a></p></footer>
      </section>
    </div>
  </main>;
}
