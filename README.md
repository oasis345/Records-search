## 주요 기능 및 설명
안녕하세요 Nextjs를 기반으로한 전적검색사이트입니다.

현재 오픈 되어 있는 게임의 간단한 전적검색, 조회 랭킹사이트 조회가 가능합니다.

제가 가진 강점을 개인 토이프로젝트에서 조회해보실수 있습니다.

# 폴더 구조
Nextjs13의 App라우터를 이용해 다이나믹하게 원하는 게임을 추가할 수 있습니다.
<br/>
<br/>
<img width="251" alt="image" src="https://github.com/oasis345/Records-search/assets/51695127/75c0c203-4c95-4eee-a46a-c850f2596baa">

<br/>
<br/>

# SEO 처리
Facebook, Twitter등 다양한 소셜 미디어에서 카드형태로 조회가능 및 sitemap, robots 처리등 검색엔진 최적화도 적용하였습니다
<br/>
<br/>
![image](https://github.com/oasis345/Records-search/assets/51695127/741edae3-f7fd-43f1-a43b-4bb2838bbd85)
![image](https://github.com/oasis345/Records-search/assets/51695127/debb5791-d88d-44d3-b0e4-557703db5679)
![image](https://github.com/oasis345/Records-search/assets/51695127/1ac05d16-7cf5-4d64-b9f6-b10fe114f748)

<br/>
<br/>



# 공통 컴포넌트 개발
예를들어 각 게임 서비스별로 공통적으로 프로필 페이지, 리더보드 페이지가 있습니다.
이에 따른 공통 컴포넌트를 만들고 실제 게임 서비스에서는 모델만 추가해줍니다.
<br/>
<br/>
<img width="350" alt="image" src="https://github.com/oasis345/Records-search/assets/51695127/07d9cfb1-d7da-4a9c-9bcf-0dab29f0a356">


<br/>

   다이나믹하게 필터 리더보드가 구성되는걸 볼수 있습니다.
<img width="1176" alt="image" src="https://github.com/oasis345/Records-search/assets/51695127/f0d06370-6498-419d-906d-4fb043689fd9">


<br/>
<br/>

# 모델기반의 코드작성
   서비스, 모델, 컴포넌트를 정확히 분리하여 작업하는 스타일을 즐겨합니다. 이는 팀 전체의 코드 유지보수에 상당한 도움이 된다 생각합니다.
   서비스에 필요한 공통 모델을 만들고 이를 각 서비스들이 상속하여 만들 수 있게 제작하였습니다.
<br/>
<br/>
<img width="362" alt="image" src="https://github.com/oasis345/Records-search/assets/51695127/f02c832c-c3fb-4326-b795-d0a5bb88c245">


<br/>
<br/>

# 반응형 웹뷰 개발
   모바일, 태블릿 등과 호환되게 반응형으로 개발중입니다.
<br/>
<br/>
![image](https://github.com/oasis345/Records-search/assets/51695127/2073e624-6627-4ced-86a9-c88633c04668)


<br/>
<br/>


   

# 전역 상태관리
   검색 혹은 전역에서 쓰이는 컴포넌트의 상태를 관리하기 위해 Recoil을 사용하였습니다.
   <br/>
   <br/>
<img width="379" alt="image" src="https://github.com/oasis345/Records-search/assets/51695127/2ccf6109-b4e1-49eb-9d2b-7d0c27314d78">
 <br/>
   <br/>
