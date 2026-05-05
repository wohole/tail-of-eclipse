# Unity 개발 준비

## 목표

`Tail of the Eclipse`를 Unity에서 2.5D 방 단위 로그라이트 슈팅액션으로 개발하기 위한 초도 준비 자료입니다.

핵심 방향은 다음과 같습니다.

- 2.5D 패럴랙스 레이어 유지
- Archero식 조작: 이동 중 회피, 멈추면 자동 사격
- 교대 플레이: 냥/뭉을 번갈아 조작
- 위상 표현: 같은 방이지만 활성 캐릭터에 따라 색온도가 바뀜
- 방 단위 진행: 방 클리어, 보상 선택, 다음 방
- 공명 시스템: 이동 흔적, 위험 감수, 적중으로 충전하고 100%에서 잠시 풀컬러 위상 합류
- 비주얼: 3D 로우폴리 모델 + 도트 셰이더 + 제한된 색온도 팔레트
- 제작 범위: 컨셉아트는 상상 자극용, 인게임은 1인 개발 가능한 컴팩트 그래픽

## 추천 Unity 버전

- Unity 2022.3 LTS 또는 Unity 6 LTS
- Render Pipeline: URP
- Target: Android/iOS 우선, PC는 개발 테스트용

## Unity 프로젝트 생성 후 폴더 구조

Unity 프로젝트를 만든 뒤 `Assets/_Project` 아래를 다음처럼 구성합니다.

```text
Assets/
  _Project/
    Art/
      Characters/
      Environments/
      VFX/
    Audio/
      BGM/
      SFX/
    Materials/
      PixelShader/
    Prefabs/
      Player/
      Enemies/
      Rooms/
      Projectiles/
      UI/
    Scenes/
      Boot.unity
      PrototypeRoom.unity
    ScriptableObjects/
      Rooms/
      Upgrades/
      Enemies/
    Scripts/
      Combat/
      Core/
      Player/
      Rooms/
      UI/
```

비주얼 기준은 [VISUAL_DIRECTION.md](./VISUAL_DIRECTION.md)를 먼저 보고 맞춥니다.

## 초도 씬 구성

`PrototypeRoom.unity`에 먼저 필요한 오브젝트:

- `RunController`: 방 진행, 보상, 런 상태 관리
- `Player`: 이동, 자동 사격, 공명 시스템
- `CharacterSwitcher`: 냥/뭉 교대와 활성 위상 관리
- `PhaseVisualController`: 녹색 그레이, 파란 그레이, 풀컬러 전환
- `RoomBounds`: 플레이 가능 영역 제한
- `EnemySpawner`: 방 목표 수만큼 적 생성
- `CameraRig`: 2.5D 고정 카메라
- `ParallaxRoot`: 배경 레이어 묶음
- `GameplayCanvas`: HP, 공명, 방 진행 UI

## 카메라 기준

2.5D는 완전 탑다운이 아니라, 기존 횡스크롤 감각을 유지한 얕은 입체 공간으로 둡니다.

- Projection: Orthographic
- Rotation: X 20~30도, Y 0도, Z 0도
- Player 이동축: X/Z
- 캐릭터 표현: 3D 모델 또는 빌보드 모델
- 전투 평면: 바닥은 Z 깊이를 가지되, 화면은 횡스크롤 무대처럼 읽히게 구성

## MVP 구현 순서

1. 방 하나에서 이동과 자동 사격
2. 적 1종 추적 AI
3. 방 클리어 조건과 다음 방 전환
4. 냥/뭉 교대와 비활성 실루엣 표시
5. 공명 게이지와 풀컬러 Eclipse 순간
6. 보상 선택 6종
7. 2.5D 패럴랙스 레이어 배치
8. 3D 도트 셰이더 테스트
9. 모바일 가상 조이스틱 적용

## 주의할 점

- 처음부터 긴 런을 만들지 말고, `30~45초짜리 방 하나`의 재미를 먼저 확인합니다.
- 공명은 별도 복잡한 버튼 콤보가 아니라, 이동과 멈춤의 리듬에 자연스럽게 얹습니다.
- 도트 셰이더는 예쁘기보다 가독성이 먼저입니다. 피격, 탄, 공명, 적 실루엣이 즉시 읽혀야 합니다.
- 모바일 기준으로 UI와 이펙트는 화면 중앙 전투를 가리지 않게 작게 시작합니다.
- 컨셉아트 퀄리티를 인게임 제작 목표로 착각하지 않습니다. 실제 그래픽은 작고, 반복 가능하고, 빠르게 만들 수 있어야 합니다.
