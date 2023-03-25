<script setup lang="ts">
import { ref } from 'vue';

const 입사일 = ref('');
const 입사일Ref = ref(null);
const 입사일Rules = ref([
  (v: string) => !!v || '입사일을 입력해주세요.',
  (v: string) => {
    const date = new Date(v);
    return date instanceof Date && !isNaN(date.getTime());
  },
]);

const 기준일 = ref(new Date().toISOString().substring(0, 10));
const 기준일Ref = ref(null);
const 기준일Rules = ref([
  (v: string) => !!v || '기준일을 입력해주세요.',
  (v: string) => {
    const date = new Date(v);
    return date instanceof Date && !isNaN(date.getTime());
  },
]);

const 제외월 = ref(0);
const 제외월Ref = ref(null);
const 제외월Rules = ref([
  (v: number) => v != undefined || '제외월을 입력해주세요.',
  (v: number) => v >= 0 || '제외월은 0 이상이어야 합니다.',
]);

const 연차팝업 = ref(false);

const calculateFullMonths = (
  joinDate: Date | string,
  baseDate: Date | string,
  monthsOfLeave = 0
): number => {
  // 소수점 버림
  monthsOfLeave = Math.floor(monthsOfLeave);

  // 입사일과 기준일에 대한 Date 객체 생성
  let join = new Date(joinDate);
  let base = new Date(baseDate);

  // 만약 입사일이 기준일보다 뒤면 두 날짜를 바꾼다
  if (join > base) {
    [join, base] = [base, join];
  }

  // 각 날짜의 년, 월, 일 정보 추출
  const joinYear = join.getFullYear();
  const joinMonth = join.getMonth();
  const joinDay = join.getDate();
  const baseYear = base.getFullYear();
  const baseMonth = base.getMonth();
  const baseDay = base.getDate();

  // 두 날짜가 속한 월의 일 수 계산
  const daysInLastMonthOfJoin = new Date(joinYear, joinMonth + 1, 0).getDate();
  const daysInLastMonthOfBase = new Date(baseYear, baseMonth + 1, 0).getDate();

  // 두 날짜가 속한 월의 일 수 중 더 작은 일 수 계산
  const minDaysInLastMonth = Math.min(
    daysInLastMonthOfJoin,
    daysInLastMonthOfBase
  );

  // 해당 입사월 일수 대비 입사일에서 입사월 말일 까지의 비율 계산
  // 각 월이 31일이 아닌 경우를 대비해 minDaysInLastMonth를 사용
  const ratioOfDaysInLastMonthOfJoin =
    (minDaysInLastMonth - Math.min(joinDay, minDaysInLastMonth)) /
    minDaysInLastMonth;

  // 해당 기준월 일 수 대비 기준월 1일 부터 기준일 까지의 비율 계산
  // 각 월이 31일이 아닌 경우를 대비해 minDaysInLastMonth를 사용
  const ratioOfDaysInLastMonthOfBase =
    Math.min(baseDay, minDaysInLastMonth) / minDaysInLastMonth;

  // 두 날짜 사이의 월 수 반환
  const monthsBetweenDates = Math.floor(
    (baseYear - joinYear) * 12 +
      (baseMonth - 1 - joinMonth) +
      ratioOfDaysInLastMonthOfJoin +
      ratioOfDaysInLastMonthOfBase
  );

  // 휴직 기간은 근무 기간 이상이 될 수 없으므로
  // 그럴 경우 근무 기간으로 휴직기간을 셋팅
  monthsOfLeave = Math.min(monthsOfLeave, monthsBetweenDates);

  // 근무 기간에서 휴직 기간을 뺀 값을 반환
  return monthsBetweenDates - monthsOfLeave;
};

// 만 근속 년수 계산
const calculateFullYears = (
  joinDate: Date | string,
  baseDate: Date | string,
  monthsOfLeave = 0
): number => {
  return Math.floor(
    calculateFullMonths(joinDate, baseDate, monthsOfLeave) / 12
  );
};

const calculateAnnuals = (
  joinDate: Date | string,
  baseDate: Date | string,
  monthsOfLeave = 0
): number => {
  // 만 근속 년수 계산
  const yearsBetweenDates = calculateFullYears(
    joinDate,
    baseDate,
    monthsOfLeave
  );
  // 만 근속 월수 계산
  const monthsBetweenDates = calculateFullMonths(
    joinDate,
    baseDate,
    monthsOfLeave
  );
  // 조건에 따라 만 근속 년수에 따른 연차 계산
  if (yearsBetweenDates < 1) {
    // 1년 미만은 만근한 월수 (최대 11개월)
    return monthsBetweenDates;
  } else {
    // 1년 이상은 기본 15일 + 2년마다 1일씩 추가 (최대 10일)
    return 15 + Math.min(10, Math.floor((yearsBetweenDates - 1) / 2));
  }
};

// 입사일과 휴가 기준일을 입력받아 해단 연차 시작기준일을 계산하는 함수
const calculateAnnualLeavePeriod = (
  joinDate: Date | string,
  baseDate: Date | string,
  monthsOfLeave = 0
): [Date, Date] => {
  // 만 근속 년수 계산
  const yearsBetweenDates = calculateFullYears(
    joinDate,
    baseDate,
    monthsOfLeave
  );
  // 만 근속 월수 계산
  const monthsBetweenDates = calculateFullMonths(
    joinDate,
    baseDate,
    monthsOfLeave
  );

  // 휴직 기간은 근무 기간 이상이 될 수 없으므로
  // 그럴 경우 근무 기간으로 휴직기간을 셋팅
  monthsOfLeave = Math.min(monthsOfLeave, monthsBetweenDates);

  // 입사일과 기준일에 대한 Date 객체 생성
  let join = new Date(joinDate);
  let base = new Date(baseDate);

  // 만약 입사일이 기준일보다 뒤면 두 날짜를 바꾼다
  if (join > base) {
    [join, base] = [base, join];
  }
  // 기준일의 년, 월, 일 정보 추출
  const joinYear = join.getFullYear();
  const joinMonth = join.getMonth();
  const joinDay = join.getDate();
  // const baseYear = base.getFullYear();
  // const baseMonth = base.getMonth();
  // const baseDay = base.getDate();

  //
  if (yearsBetweenDates < 1) {
    // 만 근속 년수가 1년 미만이면
    return [
      join,
      new Date(joinYear, joinMonth + monthsBetweenDates + 1, joinDay - 1),
    ];
  } else {
    // 만 근속 년수가 1년 이상이면
    return [
      // 근속년수 다음 해 입사일
      new Date(
        joinYear + yearsBetweenDates,
        joinMonth + monthsOfLeave,
        joinDay
      ),
      // 근속년수 + 1 다음 해 입사일 전날
      new Date(
        joinYear + yearsBetweenDates + 1,
        joinMonth + monthsOfLeave,
        joinDay - 1
      ),
    ];
  }
};

// Ref 객체의 값을 검증하는 함수
// 인자로 전달된 Ref 객체의 값이 존재하고 validate() 메소드가 존재하는 경우에만 실행
// ref: 검증할 Ref 객체
const validateRef = (ref: any) => {
  if (ref.value && typeof ref.value.validate === 'function') {
    ref.value.validate();
  }
};

// Ref 객체의 hasError 속성을 반환하는 함수
// 인자로 전달된 Ref 객체의 값이 존재하고 hasError 속성이 존재하는 경우에만 실행
// ref: hasError 속성을 참조할 Ref 객체
// 반환값: hasError 속성의 값
const hasErrorRef = (ref: any) => {
  return ref.value && ref.value.hasError;
};

// Ref 객체의 값을 검증하는 함수
// 인자로 전달된 Ref 객체의 값이 존재하고 resetValidation() 메소드가 존재하는 경우에만 실행
// ref: 검증할 Ref 객체
const resetValidationRef = (ref: any) => {
  if (ref.value && typeof ref.value.resetValidation === 'function') {
    ref.value.resetValidation();
  }
};

const submit = () => {
  // 입력값 검증

  console.log('"'+제외월.value+'"');

  validateRef(입사일Ref);
  validateRef(기준일Ref);
  validateRef(제외월Ref);

  if (
    hasErrorRef(입사일Ref) ||
    hasErrorRef(기준일Ref) ||
    hasErrorRef(제외월Ref)
  ) {
    return;
  }

  연차팝업.value = true;
};

const reset = () => {
  입사일.value = '';
  기준일.value = new Date().toISOString().substring(0, 10);
  제외월.value = 0;

  resetValidationRef(입사일Ref);
  resetValidationRef(기준일Ref);
  resetValidationRef(제외월Ref);
};
</script>

<template>
  <q-layout view="hHh Lpr fFf">
    <q-page-container>
      <q-page class="column items-center justify-center" padding>
        <q-card class="self-center" style="width: 350px">
          <q-bar dark class="full-width text-white bg-primary">
            연차 계산기
          </q-bar>
          <q-card-section>
            <q-list bordered separator>
              <q-item>
                <q-item-section>
                  <q-item-label>입사일</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-input
                    v-model="입사일"
                    ref="입사일Ref"
                    type="date"
                    filled
                    clearable
                    dense
                    :rules="입사일Rules"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-list bordered separator>
              <q-item>
                <q-item-section>
                  <q-item-label>기준일</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-input
                    v-model="기준일"
                    ref="기준일Ref"
                    type="date"
                    filled
                    clearable
                    dense
                    :rules="기준일Rules"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-list bordered separator>
              <q-item>
                <q-item-section>
                  <q-item-label>제외월</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-input
                    v-model="제외월"
                    ref="제외월Ref"
                    type="number"
                    filled
                    dense
                    :rules="제외월Rules"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-section class="row items-center">
            <q-btn color="primary" label="계산" type="submit" @click="submit" />
            <q-btn
              color="white"
              text-color="primary"
              label="초기화"
              type="reset"
              @click="reset"
            />
          </q-card-section>
          <q-dialog v-model="연차팝업" persistent class="row">
            <q-card style="max-width: 350px">
              <q-bar dark class="full-width text-white bg-primary">
                계산결과
                <q-space />
                <q-btn dense color="white" flat icon="close" v-close-popup />
              </q-bar>
              <q-card-section>
                <q-list bordered separator>
                  <q-item>
                    <q-item-section>
                      <q-item-label>입력 정보</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label class="q-my-sm"
                        >입사일 : {{ 입사일 }}</q-item-label
                      >
                      <q-item-label class="q-my-sm"
                        >기준일 : {{ 기준일 }}</q-item-label
                      >
                      <q-item-label class="q-my-sm"
                        >제외월 : {{ 제외월 }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
              <q-card-section class="q-pt-none">
                <q-list bordered separator>
                  <q-item>
                    <q-item-section>
                      <q-item-label>연차 정보</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label class="q-my-sm"
                        >만 근속 년수 :
                        {{ calculateFullYears(입사일, 기준일, 제외월) }}
                      </q-item-label>
                      <q-item-label class="q-my-sm"
                        >만 근속 월수 :
                        {{
                          calculateFullMonths(입사일, 기준일, 제외월)
                        }}</q-item-label
                      >
                      <q-item-label class="q-my-sm"
                        >연차 일수 :
                        {{ calculateAnnuals(입사일, 기준일, 제외월) }}
                      </q-item-label>
                      <q-item-label class="q-my-sm"
                        >연차 기간 :
                        {{
                          calculateAnnualLeavePeriod(
                            입사일,
                            기준일,
                            제외월
                          )[0].toLocaleDateString()
                        }}
                        ~
                        {{
                          calculateAnnualLeavePeriod(
                            입사일,
                            기준일,
                            제외월
                          )[1].toLocaleDateString()
                        }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </q-dialog>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
