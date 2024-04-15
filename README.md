## 주요 기능 및 설명
안녕하세요 Nextjs를 기반으로한 전적검색사이트입니다.

현재 오픈 되어 있는 게임의 간단한 전적검색, 조회 랭킹사이트 조회가 가능합니다.

제가 가진 강점을 개인 토이프로젝트에서 조회해보실수 있습니다.

1. 폴더 구조 Nextjs13의 App라우터를 이용해 다이나믹하게 원하는 게임을 추가할 수 있습니다.
<img width="251" alt="image" src="https://github.com/oasis345/Records-search/assets/51695127/75c0c203-4c95-4eee-a46a-c850f2596baa">


1. 공통 컴포넌트 개발
   예를들어 각 게임 서비스별로 공통적으로 프로필 페이지, 리더보드 페이지가 있습니다.
   이에 따른 공통 컴포넌트를 만들고 실제 게임 서비스에서는 모델만 추가해줍니다.
<img width="350" alt="image" src="https://github.com/oasis345/Records-search/assets/51695127/07d9cfb1-d7da-4a9c-9bcf-0dab29f0a356">

   그러면 다이나믹하게 화면이 구성되는걸 볼수 있습니다.
<img width="1176" alt="image" src="https://github.com/oasis345/Records-search/assets/51695127/f0d06370-6498-419d-906d-4fb043689fd9">

2. 모델기반의 코드작성
   서비스, 모델, 컴포넌트를 정확히 분리하여 작업하는 스타일을 즐겨합니다. 이는 팀 전체의 코드 유지보수에 상당한 도움이 된다 생각합니다.
   서비스에 필요한 공통 모델을 만들고 이를 각 서비스들이 상속하여 만들 수 있게 제작하였습니다. 

3. 전역 상태관리
   서치바 같은 전역에서 쓰이는 컴포넌트의 상태를 관리하기 위해 Recoil을 사용하였습니다.
<img width="379" alt="image" src="https://github.com/oasis345/Records-search/assets/51695127/2ccf6109-b4e1-49eb-9d2b-7d0c27314d78">

그밖에 nextjs의 fetch api와 meta데이터 처리등 여러가지를 배우며 현재 프로젝트를 진행중입니다.
   


