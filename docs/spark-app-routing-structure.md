# SPARK App Web MVP Routing Structure

## 1. Product Direction

SPARK App은 모바일 앱처럼 동작하는 웹앱이다. MVP의 핵심은 사용자가 주변 운동 모임을 찾고, 혼자 또는 모임으로 운동을 시작하며, 직접 모임을 만들고 관리할 수 있게 하는 것이다.

디자인 톤은 다크 기반 위에 라임, 퍼플, 라벤더 그라데이션 포인트를 사용하는 프리미엄 스포츠 웹앱으로 잡는다. 하단 탭 중심의 모바일 UX를 우선하고, 데스크톱에서는 모바일 프레임 또는 반응형 확장 레이아웃으로 대응한다.

## 2. MVP Priorities

| Priority | Feature | Goal |
|---|---|---|
| P0 | 운동 시작 | 혼자운동, 모임운동 진입과 실시간 운동 화면 |
| P0 | 모임 지도/탐색 | 주변 모임과 협력사 장소 기반 모임 발견 |
| P0 | 모임 CRUD | 모임 생성, 상세, 수정, 삭제, 참여/취소 |
| P1 | 홈 대시보드 | 오늘 운동 현황, 기록, 루틴, 추천 모임 |
| P1 | 협력사 데이터 연동 | Admin에서 관리하는 장소/서비스/광고를 App에 노출 |
| P2 | 챌린지/마이페이지 | 포트폴리오 완성도를 위한 기록, 배지, 랭킹, 설정 |

## 3. Bottom Navigation

```txt
홈        -> /home
모임      -> /groups
spark     -> /spark
챌린지    -> /challenge
마이페이지 -> /profile
```

`spark`는 중앙 주요 액션 탭으로 취급한다. 하단 탭에서 가장 강한 시각적 강조를 주고, 클릭 시 혼자운동/모임운동 선택 허브로 이동한다.

## 4. Top Level Routes

```txt
/
/login
/onboarding
/home
/groups
/spark
/activity
/challenge
/profile
/partners
```

| Route | Page | MVP Role |
|---|---|---|
| `/` | Entry router | 로그인/온보딩 상태에 따라 `/home`, `/login`, `/onboarding`으로 이동 |
| `/login` | 로그인 | 카카오/구글/애플/전화번호 인증 UI. MVP에서는 mock login |
| `/onboarding` | 온보딩 플로우 | 사용자 운동성향, 권한, 추천 기준 수집 |
| `/home` | 홈 대시보드 | 운동 시작, 오늘 현황, 루틴, 추천 모임, 광고 |
| `/groups` | 모임 탐색 | 지도/리스트, 필터, 모임 CRUD 진입 |
| `/spark` | 운동 시작 허브 | 혼자운동/모임운동 선택 |
| `/activity/live` | 실시간 운동 | 운동 타입별 라이브 콕핏 |
| `/activity/summary` | 운동 완료 요약 | 기록 저장, 챌린지 반영 |
| `/challenge` | 챌린지 | 앱 제공 챌린지, 랭킹, 이벤트 |
| `/profile` | 마이페이지 | 운동 피드, 참여 모임, 배지, 친구, 설정 |
| `/partners` | 협력사 탐색 | 협력사 상세/장소 상세 진입. 모임 지도와 연결 |

## 5. Auth And Onboarding

```txt
/login
/login/phone
/onboarding
/onboarding/profile
/onboarding/goals
/onboarding/preferences
/onboarding/permissions
```

| Route | Page | Core Features | Data Used |
|---|---|---|---|
| `/login` | 로그인 | 카카오, 구글, 애플, 전화번호 로그인 버튼 | mock user |
| `/login/phone` | 전화번호 인증 | 전화번호 입력, 인증번호 입력, 재전송 | mock verification |
| `/onboarding/profile` | 기본정보 | 닉네임 중복체크, 나이, 성별 | UserProfile |
| `/onboarding/goals` | 운동 목표 | 감량, 체력, 습관, 기록 향상, 모임 참여 | UserGoal |
| `/onboarding/preferences` | 운동성향 | 관심 운동, 횟수, 시간대, 강도, 운동레벨 | UserPreference |
| `/onboarding/permissions` | 권한 요청 | 위치, 건강데이터, 알림 권한 요청 | PermissionState |

MVP에서는 실제 인증과 권한 연동 대신 mock 상태를 사용한다. 다만 코드 구조는 나중에 OAuth, 위치 API, 건강데이터 API로 교체할 수 있도록 분리한다.

## 6. Home Routes

```txt
/home
```

| Section | Core Features | UX Note |
|---|---|---|
| 운동 시작 CTA | 혼자운동 시작, 모임운동 시작 | 홈 최상단에 가장 크게 배치 |
| 오늘 운동 현황 | 걸음수, 칼로리, 활동 시간, 심박 요약 | 건강데이터 mock 사용 |
| 도전/루틴 | 연속 도전일, 오늘 루틴, 다음 루틴 | 운동 시작으로 연결 |
| 추천 모임 | 성향/레벨/위치 기반 추천 모임 | `/groups/:groupId`로 연결 |
| 모임 만들기/찾기 | 빠른 생성, 지도 탐색 | `/groups/new`, `/groups`로 연결 |
| 이전 운동 로그 | 카드형 최근 기록 | `/activity/summary/:activityId`로 연결 |
| 업체 광고 | 협력사 광고/프로모션 카드 | `/partners/:partnerId` 또는 외부 링크 |

홈은 정보 나열이 아니라 오늘 운동을 시작시키는 대시보드로 설계한다. 광고는 주요 CTA보다 위에 두지 않고, 추천 모임 사이 또는 하단 배너로 배치한다.

## 7. Group Routes

```txt
/groups
/groups/new
/groups/:groupId
/groups/:groupId/edit
/groups/:groupId/chat
```

| Route | Page | Core Features | Data Used |
|---|---|---|---|
| `/groups` | 모임 지도/목록 | 지도 보기, 리스트 보기, 필터, 정렬, 주변 모임 핀 | Meetup, PartnerLocation |
| `/groups/new` | 모임 만들기 | 종목, 장소, 일정, 난이도, 인원, 유료/무료, 준비물 입력 | MeetupCreateInput |
| `/groups/new?partnerId=&locationId=` | 협력사 장소 기반 모임 만들기 | 선택된 협력사/장소를 기본값으로 모임 생성 | Partner, PartnerLocation |
| `/groups/:groupId` | 모임 상세 | 지도, 시작 시간, 참가자, 준비물, 난이도, 호스트 정보, 참여/취소 | Meetup |
| `/groups/:groupId/edit` | 모임 수정 | 작성자 또는 권한 있는 사용자만 수정 | MeetupUpdateInput |
| `/groups/:groupId/chat` | 모임 채팅 | MVP에서는 채팅 미리보기 또는 mock thread | ChatThread |

### Group Filters

| Filter | Values |
|---|---|
| 거리 | 가까운 순, 1km, 3km, 5km, 10km |
| 시간 | 오늘, 내일, 이번 주, 주말 |
| 운동 종목 | 러닝, 라이딩, 걷기, 헬스, 등산, 자유 운동 |
| 난이도 | 입문, 초급, 중급, 고급 |
| 성별/연령대 | 전체, 여성 전용, 남성 전용, 20대, 30대, 40대+ |
| 인원수 | 모집 중, 마감 임박, 소규모, 대규모 |
| 비용 | 무료, 유료 |
| 장소 유형 | 일반 장소, 협력사 장소 |

## 8. Spark Routes

```txt
/spark
/spark/solo
/spark/group
/spark/recommend
```

| Route | Page | Core Features | Data Used |
|---|---|---|---|
| `/spark` | 운동 시작 허브 | 혼자운동, 모임운동 선택 | UserPreference |
| `/spark/solo` | 혼자운동 | 러닝, 라이딩, 걷기, 헬스, 등산, 자유 운동, 직접입력 | ActivityPreset |
| `/spark/group` | 모임운동 | 근처 모임 추천, 내 성향/레벨 기반 추천 | Meetup, UserPreference |
| `/spark/recommend` | 맞춤 운동 추천 | 오늘 컨디션, 시간대, 선호 운동 기반 추천 | Recommendation |

`spark`는 사용자의 의도를 빠르게 정하는 화면이다. 복잡한 입력보다 선택형 인터페이스를 우선한다.

## 9. Activity Routes

```txt
/activity/live
/activity/live/:activityType
/activity/summary/:activityId
```

| Route | Page | Core Features | Data Used |
|---|---|---|---|
| `/activity/live` | 기본 라이브 운동 | 최근 선택 운동 타입으로 시작 | ActivitySession |
| `/activity/live/:activityType` | 운동 타입별 라이브 | 유산소/무산소/대결운동 UI 분기 | ActivitySession |
| `/activity/summary/:activityId` | 운동 완료 요약 | 시간, 거리, 칼로리, 심박, 경로, 챌린지 반영 | ActivityLog |

### Live Activity Modes

| Mode | Display |
|---|---|
| 유산소 | 시간, 거리, 속도/페이스, 칼로리, 심박수, 경로, 고도 |
| 무산소 | 세트, 반복수, 휴식 타이머, 볼륨, 칼로리, 심박수 |
| 대결운동 | 상대/그룹 진행률, 순위, 페이스 차이, 함께 운동 중인 사람 |

## 10. Challenge Routes

```txt
/challenge
/challenge/:challengeId
```

| Route | Page | Core Features | Data Used |
|---|---|---|---|
| `/challenge` | 챌린지 홈 | 앱 제공 챌린지, 개인 목표, 친구 랭킹, 지역 랭킹, 이벤트 | Challenge |
| `/challenge/:challengeId` | 챌린지 상세 | 진행률, 조건, 보상, 참여자, 랭킹 | Challenge |

사용자는 챌린지를 직접 만들 수 없다. Admin 또는 앱 운영 데이터에서 제공되는 챌린지만 참여한다.

## 11. Profile Routes

```txt
/profile
/profile/logs
/profile/groups
/profile/badges
/profile/friends
/profile/settings
```

| Route | Page | Core Features | Data Used |
|---|---|---|---|
| `/profile` | 마이페이지 홈 | 프로필, 요약 통계, 최근 운동 피드 | UserProfile, ActivityLog |
| `/profile/logs` | 운동 기록 | 피드형 운동 기록, 필터, 상세 진입 | ActivityLog |
| `/profile/groups` | 참여 모임 관리 | 신청, 참여 예정, 완료, 취소 모임 | MeetupParticipation |
| `/profile/badges` | 배지 | 챌린지/운동 달성 배지 | Badge |
| `/profile/friends` | 친구 | 친구 목록, 친구 랭킹, 초대 | Friend |
| `/profile/settings` | 설정 | 프로필 편집, 알림, 권한, 계정 설정 | UserSettings |

## 12. Partner Routes

```txt
/partners/:partnerId
/partners/:partnerId/locations/:locationId
/partners/:partnerId/services/:serviceId
```

| Route | Page | Core Features | Admin Source |
|---|---|---|---|
| `/partners/:partnerId` | 협력사 상세 | 업체 소개, 평점, 장소, 서비스, 프로모션, 리뷰 | adminApp Partner/Business |
| `/partners/:partnerId/locations/:locationId` | 협력사 장소 상세 | 지도, 주소, 영업시간, 노출 중인 모임, 여기서 모임 만들기 | adminApp Location |
| `/partners/:partnerId/services/:serviceId` | 서비스 상세 | 상품/서비스 소개, 가격, 프로모션, 예약 유도 | adminApp Service |

협력사 상세는 App에서 광고, 지도 핀, 추천 모임 카드가 연결되는 목적지다.

## 13. Admin Integration Plan

현재 `adminApp`에는 DB가 없고 mock 데이터만 있다. MVP에서는 App과 Admin을 직접 연결하지 않고, 공통 데이터 계층을 만든다.

추천 구조:

```txt
spark 프로덕트 제작/
  adminApp/
  sparkApp/
  shared/
    types/
    mock-data/
    data-access/
```

초기에는 `shared/mock-data`를 App과 Admin이 함께 참조한다. 이후 DB를 붙일 때는 `shared/data-access` 내부 구현만 교체한다.

### Admin To App Data Flow

| Admin Data | App Exposure |
|---|---|
| 협력사 기본정보 | `/partners/:partnerId`, 광고 카드 |
| 협력사 장소 | `/groups` 지도 핀, 장소 상세 |
| 협력사 서비스/상품 | 협력사 상세, 광고/프로모션 |
| 모임 노출 설정 | `/groups`에서 노출 여부 결정 |
| 앱 제공 챌린지 | `/challenge` |
| 콘텐츠/광고 | `/home`, `/groups`, `/partners/:partnerId` |

## 14. Shared Data Models

```ts
export type ActivityType =
  | "running"
  | "riding"
  | "walking"
  | "gym"
  | "hiking"
  | "free"
  | "custom";

export type ActivityMode = "cardio" | "strength" | "versus";

export type MeetupLevel = "beginner" | "easy" | "medium" | "hard";

export type PriceType = "free" | "paid";

export type LocationType = "user_place" | "partner_location";

export interface Partner {
  id: string;
  name: string;
  category: string;
  status: "pending" | "active" | "inactive" | "suspended";
  description: string;
  rating: number;
  reviewCount: number;
  contact: string;
  imageUrl?: string;
}

export interface PartnerLocation {
  id: string;
  partnerId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  operatingHours: string;
  meetupExposure: boolean;
  exposureRadiusKm: number;
}

export interface PartnerService {
  id: string;
  partnerId: string;
  name: string;
  category: string;
  price: number;
  description: string;
  promotion?: {
    discount: number;
    endDate: string;
  };
}

export interface Meetup {
  id: string;
  title: string;
  activityType: ActivityType;
  level: MeetupLevel;
  startAt: string;
  capacity: number;
  participantCount: number;
  genderPolicy: "all" | "women_only" | "men_only";
  ageRange?: string;
  priceType: PriceType;
  price?: number;
  locationType: LocationType;
  partnerId?: string;
  locationId?: string;
  address: string;
  lat: number;
  lng: number;
  hostId: string;
  hostTrustScore: number;
  supplies: string[];
  status: "draft" | "open" | "full" | "cancelled" | "completed";
}

export interface ActivityLog {
  id: string;
  userId: string;
  activityType: ActivityType;
  mode: ActivityMode;
  startedAt: string;
  durationMinutes: number;
  distanceKm?: number;
  calories: number;
  averageHeartRate?: number;
  elevationGainM?: number;
  meetupId?: string;
}

export interface Challenge {
  id: string;
  title: string;
  type: "personal" | "friend_rank" | "local_rank" | "event";
  description: string;
  progress: number;
  target: number;
  unit: string;
  status: "available" | "joined" | "completed";
}

export interface AdPlacement {
  id: string;
  partnerId: string;
  title: string;
  description: string;
  imageUrl?: string;
  placement: "home" | "groups" | "partner_detail";
  startsAt: string;
  endsAt: string;
  status: "draft" | "active" | "ended";
}
```

## 15. Suggested Next App Router Structure

```txt
src/
  app/
    page.tsx
    login/
      page.tsx
      phone/page.tsx
    onboarding/
      page.tsx
      profile/page.tsx
      goals/page.tsx
      preferences/page.tsx
      permissions/page.tsx
    home/
      page.tsx
    groups/
      page.tsx
      new/page.tsx
      [groupId]/
        page.tsx
        edit/page.tsx
        chat/page.tsx
    spark/
      page.tsx
      solo/page.tsx
      group/page.tsx
      recommend/page.tsx
    activity/
      live/page.tsx
      live/[activityType]/page.tsx
      summary/[activityId]/page.tsx
    challenge/
      page.tsx
      [challengeId]/page.tsx
    profile/
      page.tsx
      logs/page.tsx
      groups/page.tsx
      badges/page.tsx
      friends/page.tsx
      settings/page.tsx
    partners/
      [partnerId]/
        page.tsx
        locations/[locationId]/page.tsx
        services/[serviceId]/page.tsx
  components/
    layout/
    home/
    groups/
    spark/
    activity/
    challenge/
    profile/
    partners/
  shared/
    data/
    types/
    data-access/
```

## 16. Build Order

1. 공통 타입과 mock 데이터 작성
2. 모바일 앱 Shell, 하단 탭, 라우팅 레이아웃 구현
3. `/home` 대시보드 구현
4. `/groups` 지도/목록/필터 구현
5. `/groups/new`, `/groups/:groupId` CRUD 구현
6. `/spark`, `/spark/solo`, `/spark/group` 구현
7. `/activity/live`, `/activity/summary` 구현
8. `/partners/:partnerId` 협력사 상세 연결
9. `/challenge`, `/profile` 구현
10. Admin mock 데이터와 shared mock 데이터 정합성 맞추기
