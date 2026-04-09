# momo Store (Pinia)

`useMomoStore`는 모모 상태와 거래내역을 관리하는 Pinia 스토어입니다.  
외부에서는 **userId만 알고 있으면** 대부분의 기능을 사용할 수 있습니다.

---

## 사용법

```js
import { useMomoStore } from '@/stores/momo';

const momoStore = useMomoStore();
```

---

## 타입 정의 (Data Shapes)

### `MomoData`

```js
{
  id: string | number,
  userId: string,
  isMomoHappy: boolean,
  momoExp: number,
  momoLevel: number,
  momoMission: string,
  momoMissionAssignedAt: string,
  momoAttendance: number,
  momoFinalAttendance: string
}
```

### `MomoDataPayload` (부분 업데이트 가능)

```js
{
  isMomoHappy?: boolean,
  momoExp?: number,
  momoLevel?: number,
  momoMission?: string,
  momoMissionAssignedAt?: string,
  momoAttendance?: number,
  momoFinalAttendance?: string
}
```

### `MomoDataCreatePayload`

```js
{
  userId: string,
  isMomoHappy?: boolean,
  momoExp?: number,
  momoLevel?: number,
  momoMission?: string,
  momoMissionAssignedAt?: string,
  momoAttendance?: number,
  momoFinalAttendance?: string
}
```

### `Transaction`

```js
{
  id: string | number,
  userId: string,
  date: string, // YYYY-MM-DD
  type: 'income' | 'expense',
  amount: number,
  desc: string,
  category: string
}
```

### `TransactionPayload` (PUT 기준 전체 객체 전달 권장)

```js
{
  id?: string | number,
  userId: string,
  date: string,
  type: 'income' | 'expense',
  amount: number,
  desc: string,
  category: string
}
```

---

## 상태 (State)

### 공통

- `isFetching: Ref<boolean>` — 현재 요청 진행 여부
- `isError: Ref<boolean>` — 최근 작업 에러 여부

### 모모 상태

- `isMomoHappy: Ref<boolean>`
- `momoExp: Ref<number>`
- `momoLevel: Ref<number>`
- `momoMission: Ref<string>`
- `momoMissionAssignedAt: Ref<string>`
- `momoAttendance: Ref<number>`
- `momoFinalAttendance: Ref<string>`

### 내부 캐시 (일반적으로 직접 사용 X)

- `currentMomoUserId: Ref<string | null>`
- `momoDataId: Ref<string | number | null>`

### 거래

- `transactionList: Ref<Transaction[]>`

---

## 모모 관련 액션

### `fetchMomoData(userId)`

특정 유저의 모모 데이터를 조회하여 상태에 반영합니다.

- **params**: `userId: string`
- **returns**: `Promise<void>`

```js
await momoStore.fetchMomoData('1111');
```

---

### `createMomoData(payload)`

모모 데이터를 새로 생성합니다.

- **params**: `payload: MomoDataCreatePayload`
- **returns**: `Promise<MomoData>`

```js
await momoStore.createMomoData({ userId: '1111', momoExp: 10 });
```

---

### `editMomoData(userId, payload)`

모모 데이터를 수정합니다. 해당 유저의 데이터가 없으면 생성합니다.

- **params**:
  - `userId: string`
  - `payload: MomoDataPayload`
- **returns**: `Promise<MomoData>`

```js
await momoStore.editMomoData('1111', {
  momoExp: 50,
  momoMission: '절약하기',
});
```

---

### 부분 업데이트 (Convenience)

- `updateIsMomoHappy(userId, isHappy)` → `Promise<MomoData>`
- `updateMomoExp(userId, exp)` → `Promise<MomoData>`
- `updateMomoLevel(userId, level)` → `Promise<MomoData>`
- `updateMomoMission(userId, mission, assignedAt?)` → `Promise<MomoData>`
- `updateMomoAttendance(userId, attendance, finalAttendance?)` → `Promise<MomoData>`

```js
await momoStore.updateMomoExp('1111', 100);
```

---

### `resetMomoData()`

모모 상태를 초기값으로 리셋합니다.

- **params**: 없음
- **returns**: `void`

---

## 거래 관련 액션

### `fetchTransactionList(userId)`

거래 목록 조회

- **params**: `userId: string`
- **returns**: `Promise<void>`

```js
await momoStore.fetchTransactionList('1111');
```

---

### `addTransactionData(payload)`

거래 추가

- **params**: `payload: TransactionPayload`
- **returns**: `Promise<void>`

```js
await momoStore.addTransactionData({ ... })
```

---

### `editTransactionData(id, payload)`

거래 수정 (현재 구현은 `PUT` 기반으로 **전체 객체 전달 권장**)

- **params**:
  - `id: string | number`
  - `payload: TransactionPayload`
- **returns**: `Promise<void>`

---

### `deleteTransactionData(id)`

거래 삭제

- **params**: `id: string | number`
- **returns**: `Promise<void>`

---

## 설계 포인트

- 외부에서는 **userId만 사용**
- 내부적으로 `momoDataId`를 캐싱하여 성능 최적화
- 데이터가 없으면 자동 생성하는 구조

---

## 권장 사용 흐름

```js
await momoStore.fetchMomoData(userId);
await momoStore.updateMomoExp(userId, 50);
```

거래:

```js
await momoStore.addTransactionData(payload);
await momoStore.fetchTransactionList(userId);
```

---

# auth Store (Pinia)

`useAuthStore`는 회원가입, 로그인, 로그아웃, 세션 복원을 담당하는 Pinia 스토어입니다.  
이 스토어는 **json-server 기반의 학습용 인증 흐름**을 구현하며, 보안보다는 구조 이해에 초점을 둡니다.

---

## 사용법

```js
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
```

---

## 상태 (State)

### 공통

- `isFetching: Ref<boolean>` — 요청 진행 여부
- `isError: Ref<boolean>` — 에러 발생 여부
- `errorMessage: Ref<string>` — 에러 메시지

### 인증 상태

- `currentUserId: Ref<string | null>` — 현재 로그인된 유저 id
- `currentUsername: Ref<string>` — 현재 로그인된 username
- `isLogin: Ref<boolean>` — 로그인 여부

### 파생 상태

#### `currentUser`

```js
{
  userId: string,
  username: string
} | null
```

- 로그인 상태일 경우 유저 객체 반환
- 비로그인 상태일 경우 `null`

---

## 저장 방식

로그인 상태는 **sessionStorage**에 저장됩니다.

```js
{
  userId: string,
  username: string,
  isLogin: true
}
```

- 비밀번호는 저장하지 않음
- 브라우저 탭 종료 시 자동 로그아웃

---

## 액션 (Actions)

## 1. 회원가입

### `signup({ username, password })`

회원가입을 수행하고, 성공 시 자동 로그인합니다.

### params

```js
{
  username: string,
  password: string
}
```

### returns

```js
Promise<User>
```

```js
{
  id: string | number,
  username: string,
  password: string
}
```

### 동작

1. username 중복 검사
2. 신규 사용자 생성
3. 로그인 상태 설정
4. sessionStorage 저장

---

## 2. 로그인

### `login({ username, password })`

username과 password를 검증하여 로그인합니다.

### params

```js
{
  username: string,
  password: string
}
```

### returns

```js
Promise<User>
```

### 동작

1. username으로 사용자 조회
2. password 비교
3. 로그인 상태 설정
4. sessionStorage 저장

---

## 3. 로그아웃

### `logout()`

로그인 상태를 초기화하고 sessionStorage를 제거합니다.

### returns

```js
void
```

---

## 4. 세션 복원

### `restoreSession()`

브라우저 새로고침 시 sessionStorage를 기반으로 로그인 상태를 복원합니다.

### returns

```js
boolean;
```

- `true`: 세션 복원 성공
- `false`: 세션 없음 또는 실패

---

## 5. 유틸 함수

### `clearError()`

- 에러 상태 초기화

### `clearAuthState()`

- 로그인 상태 초기화 (메모리만)

### `persistAuth()`

- 현재 로그인 상태를 sessionStorage에 저장

### `setAuthState(user)`

- 로그인 성공 시 상태 설정

---

## 설계 포인트

- 비밀번호는 저장하지 않음
- sessionStorage 기반 세션 관리
- 인증 상태는 store에서만 관리
- 다른 store(momoStore)는 userId만 사용

---

## 권장 사용 흐름

### 앱 시작 시

```js
authStore.restoreSession();
```

---

### 로그인

```js
await authStore.login({ username, password });
```

---

### 회원가입

```js
await authStore.signup({ username, password });
```

---

### 로그아웃

```js
authStore.logout();
```

---

## momoStore와의 연동

```js
const authStore = useAuthStore();
const momoStore = useMomoStore();

await momoStore.fetchMomoData(authStore.currentUserId);
```

---
