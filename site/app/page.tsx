'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BookMarked, Check, ChevronLeft, ChevronRight, Circle, Code2, ExternalLink, Flame, GraduationCap, LibraryBig, Menu, RotateCcw, Sparkles, Trophy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { editions } from './ecma-data';

export default function Home() {
  const [chapter, setChapter] = useState(0);
  const [turn, setTurn] = useState<'next'|'prev'|null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [answer, setAnswer] = useState<number|null>(null);
  const [checked, setChecked] = useState(false);
  const [scores, setScores] = useState<Record<string,number>>({});
  const [mobileNav, setMobileNav] = useState(false);
  const edition = editions[chapter];
  const question = edition.questions[quizIndex];
  const correct = checked && answer === question.answer;
  const answeredCount = Object.keys(scores).length;

  const goTo = useCallback((next: number) => {
    if (next < 0 || next >= editions.length || next === chapter || turn) return;
    setTurn(next > chapter ? 'next' : 'prev');
    window.setTimeout(() => {
      setChapter(next); setQuizIndex(0); setAnswer(null); setChecked(false); setTurn(null);
      document.querySelector('#book')?.scrollIntoView({ behavior:'smooth', block:'start' });
    }, 430);
  }, [chapter, turn]);

  const nextQuestion = () => {
    if (quizIndex < edition.questions.length - 1) { setQuizIndex(i=>i+1); setAnswer(null); setChecked(false); }
    else if (chapter < editions.length - 1) goTo(chapter + 1);
  };

  const checkAnswer = () => {
    if (answer === null) return;
    setChecked(true);
    setScores(current => ({ ...current, [`${edition.id}-${quizIndex}`]: answer === question.answer ? 1 : 0 }));
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') goTo(chapter + 1);
      if (event.key === 'ArrowLeft') goTo(chapter - 1);
    };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, [chapter, goTo]);

  useEffect(() => {
    const context=(document as Document & {modelContext?:{registerTool:(tool:unknown,options?:{signal?:AbortSignal})=>void|Promise<void>}}).modelContext;
    if(!context?.registerTool)return; const lifecycle=new AbortController();
    const tool={name:'open_ecmascript_edition',title:'ECMAScriptの版を開く',description:'指定したECMAScript版を本の現在の章として開きます。',inputSchema:{type:'object',properties:{editionId:{type:'string',enum:editions.map(item=>item.id)}},required:['editionId'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input:unknown){const id=typeof input==='object'&&input!==null&&'editionId'in input?(input as{editionId?:unknown}).editionId:undefined;const index=editions.findIndex(item=>item.id===id);if(index<0)throw new Error('Unknown editionId');setChapter(index);setQuizIndex(0);setAnswer(null);setChecked(false);return{editionId:id,title:editions[index].name,status:'opened'}}};
    try{void Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>undefined)}catch{} return()=>lifecycle.abort();
  },[]);

  const correctTotal = useMemo(()=>Object.values(scores).reduce((sum,value)=>sum+value,0),[scores]);

  return <main className="chronicle-app" id="top">
    <header className="topbar">
      <a className="brand" href="#top"><span className="brand-mark">JS</span><span>JS Chronicle</span></a>
      <div className="topbar-center"><Badge className="edition-badge">ECMA-262 COMPLETE ARCHIVE</Badge><span className="save-state"><LibraryBig size={14}/> 1997—2026</span></div>
      <div className="topbar-actions"><div className="streak"><Flame size={16}/><b>{answeredCount}</b><span>問に挑戦</span></div><button className="avatar" aria-label="プロフィール">YR</button><Button variant="ghost" size="icon" className="menu-button" onClick={()=>setMobileNav(!mobileNav)} aria-label="目次">{mobileNav?<X/>:<Menu/>}</Button></div>
    </header>

    <div className="app-shell">
      <aside className={`sidebar archive-sidebar ${mobileNav?'sidebar-open':''}`}>
        <div className="progress-block"><div className="progress-label"><span>歴史の踏破率</span><strong>{Math.round(((chapter+1)/editions.length)*100)}%</strong></div><Progress value={((chapter+1)/editions.length)*100} className="course-progress"/><small>{chapter+1} / {editions.length} chapters</small></div>
        <p className="nav-eyebrow">THE COMPLETE CHRONICLE</p>
        <nav className="edition-nav" aria-label="ECMAScript版の目次">
          {editions.map((item,index)=><button key={item.id} className={chapter===index?'active':''} onClick={()=>{goTo(index);setMobileNav(false)}}><span className="edition-spine">{item.edition}</span><span><b>{item.name}</b><small>{item.year} · {item.subtitle}</small></span>{index<chapter?<Check/>:<ChevronRight/>}</button>)}
        </nav>
      </aside>

      <section className="content book-content">
        <div className="adventure-heading">
          <div><p className="kicker"><span>ECMA-262 ARCHIVE</span><span className="kicker-line"/>全17版＋幻のES4</p><h1>仕様書をめくり、<br/><em>JavaScriptの歴史を冒険する。</em></h1><p className="intro">公式アーカイブを一冊の年代記に。左右キーでも章をめくれます。</p></div>
          <div className="journey-stat"><span>{String(chapter+1).padStart(2,'0')}</span><small>/ {editions.length}<br/>CHAPTERS</small></div>
        </div>

        <section className="book-stage" id="book" aria-live="polite">
          <div className="book-shadow"/>
          <article className={`open-book ${turn?`turning-${turn}`:''}`}>
            <div className="book-gutter"/>
            <section className="book-page page-left">
              <div className="page-running-head"><span>ECMA-262</span><span>{edition.year}</span></div>
              <div className="edition-hero"><span className="edition-number">{edition.edition}</span><p>EDITION</p></div>
              <Badge className="year-badge">{edition.year}</Badge>
              <h2>{edition.name}</h2><h3>{edition.subtitle}</h3>
              <p className="lead-copy">{edition.summary}</p>
              <div className="chapter-rule"><span>WHY IT MATTERED</span></div>
              <p className="body-copy">{edition.context}</p>
              <blockquote>{edition.impact}</blockquote>
              <div className="page-number">{chapter*2+1}</div>
            </section>

            <section className="book-page page-right">
              <div className="page-running-head"><span>LANGUAGE NOTES</span><span>JS CHRONICLE</span></div>
              <p className="mini-title"><Sparkles/> この版の重要ポイント</p>
              <div className="feature-list">{edition.features.map((feature,index)=><div key={feature}><span>{String(index+1).padStart(2,'0')}</span><b>{feature}</b></div>)}</div>
              <div className="code-paper"><div><i/><i/><i/><span>{edition.id}.js</span></div><pre><code>{edition.code}</code></pre></div>
              <a className="official-link" href={edition.officialUrl} target="_blank" rel="noreferrer"><BookMarked/>公式仕様を開く<ExternalLink/></a>
              <div className="page-number">{chapter*2+2}</div>
            </section>
            {turn&&<div className="turning-sheet" aria-hidden="true"><div className="sheet-front"><span>{edition.name}</span></div><div className="sheet-back"><span>次の章へ</span></div></div>}
          </article>
          <button className="book-arrow prev" onClick={()=>goTo(chapter-1)} disabled={chapter===0||!!turn} aria-label="前の章"><ChevronLeft/></button>
          <button className="book-arrow next" onClick={()=>goTo(chapter+1)} disabled={chapter===editions.length-1||!!turn} aria-label="次の章"><ChevronRight/></button>
        </section>

        <div className="chapter-dots" aria-label="章を選ぶ">{editions.map((item,index)=><button key={item.id} className={chapter===index?'active':''} onClick={()=>goTo(index)} aria-label={`${item.name}を開く`}><span/></button>)}</div>

        <section className="quiz-card expanded-quiz" id="quiz">
          <div className="quiz-top"><div><p className="section-kicker"><GraduationCap size={15}/> CHAPTER CHECKPOINT</p><h2>{edition.name}を理解できた？</h2></div><span className="quiz-count">{quizIndex+1} / {edition.questions.length}</span></div>
          <div className="quiz-progress">{edition.questions.map((_,index)=><span key={index} className={index<=quizIndex?'filled':''}/>)}</div>
          <p className="question">{question.question}</p>
          <div className="choices">{question.choices.map((choice,index)=>{const good=checked&&index===question.answer;const bad=checked&&answer===index&&index!==question.answer;return <button key={choice} className={`${answer===index?'selected':''} ${good?'correct':''} ${bad?'wrong':''}`} onClick={()=>{setAnswer(index);setChecked(false)}}><span>{String.fromCharCode(65+index)}</span>{choice}{good&&<Check className="choice-result"/>}{bad&&<X className="choice-result"/>}</button>})}</div>
          {checked&&<div className={`feedback ${correct?'success':'retry'}`}>{correct?<Check/>:<RotateCcw/>}<p><b>{correct?'正解！年代記に刻まれました。':'もう一度、ページを読み返そう。'}</b><span>{question.explanation}</span></p></div>}
          <div className="quiz-actions"><span><Trophy size={15}/> 正解 {correctTotal} / 挑戦 {answeredCount}</span><div className="quiz-buttons">{!checked?<Button onClick={checkAnswer} disabled={answer===null} className="check-button">答えを確認 <ArrowRight/></Button>:<Button onClick={nextQuestion} className="check-button">{quizIndex<edition.questions.length-1?'次の問題':'次の章へ'} <ArrowRight/></Button>}</div></div>
        </section>

        <section className="next-card active-next">
          <div className="next-icon"><BookMarked/></div><div><small>{chapter<editions.length-1?'NEXT CHAPTER':'JOURNEY COMPLETE'}</small><h2>{chapter<editions.length-1?editions[chapter+1].name:'ECMAScriptの旅を完走しました'}</h2><p>{chapter<editions.length-1?editions[chapter+1].subtitle:'好きな章へ戻り、知識を何度でも深められます。'}</p></div>
          <Button variant="outline" onClick={()=>chapter<editions.length-1?goTo(chapter+1):goTo(0)}>{chapter<editions.length-1?'次へ進む':'最初から読む'} <ArrowRight/></Button>
        </section>

        <footer><span>JS Chronicle</span><p>Based on the complete <a href="https://ecma-international.org/publications-and-standards/standards/ecma-262/" target="_blank" rel="noreferrer">ECMA-262 archive</a></p></footer>
      </section>
    </div>
  </main>;
}
