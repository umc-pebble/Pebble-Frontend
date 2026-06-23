import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      {/* 
        테마 적용을 원하시면 최상위 div나 html, body 태그에
        className="theme-popart" 등 테마 클래스를 추가하시면 됩니다. 
      */}
      <div className="min-h-screen bg-fill-surface text-text-strong font-sans flex flex-col items-center justify-center p-token-xl">
        <Routes>
          <Route path="/" element={
            <div className="text-center flex flex-col gap-token-m">
              <h1 className="text-heading-01 text-theme-1-base">Pebble Frontend</h1>
              <p className="text-body-01-m text-text-primary">
                프로젝트 초기 셋팅 페이지입니다.
              </p>
              <p className="text-body-03-r text-text-secondary mt-token-s">
                README.MD 파일과 design.md 파일을 확인하고 작업해주세요.
              </p>
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;
