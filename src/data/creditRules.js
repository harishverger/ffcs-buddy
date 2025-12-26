// Reusable lab pairs
const LAB_PAIRS = [
  "L2+L3",
  "L4+L5",
  "L8+L9",
  "L10+L11",
  "L14+L15",
  "L16+L17",
  "L20+L21",
  "L22+L23",
  "L26+L27",
  "L28+L29",
  "L31+L32",
  "L33+L34",
  "L35+L36",
  "L37+L38",
  "L39+L40",
  "L41+L42",
  "L43+L44",
  "L45+L46",
  "L47+L48",
  "L49+L50",
  "L51+L52",
  "L53+L54",
  "L55+L56"
];

// 4-credit theory-only subjects: triple combos (primary + two tutorials)
const FOUR_CREDIT_THEORY_TRIPLES = [
  "A1+TA1+TAA1",
  "A2+TA2+TAA2",

  "B1+TB1+TBB1",
  "B2+TB2+TBB2",

  "C1+TC1+TCC1",
  "C2+TC2+TCC2",

  "D1+TD1+TDD1",
  "D2+TD2+TDD2",

  "E1+TE1+TEE1",
  "E2+TE2+TEE2",

  "F1+TF1+TFF1",
  "F2+TF2+TFF2",

  "G1+TG1+TGG1"
];

// 4-credit theory+lab subjects: only two-slot combos (primary + one tutorial)
const FOUR_CREDIT_THEORY_PAIRS = [
  "A1+TA1", "A1+TAA1",
  "A2+TA2", "A2+TAA2",

  "B1+TB1", "B1+TBB1",
  "B2+TB2", "B2+TBB2",

  "C1+TC1", "C1+TCC1", "C1+SC1",
  "C2+TC2", "C2+TCC2", "C2+SC2",

  "D1+TD1", "D1+TDD1", "D1+SD1",
  "D2+TD2", "D2+TDD2", "D2+SD2",

  "E1+TE1", "E1+TEE1", "E1+SE1",
  "E2+TE2", "E2+TEE2", "E2+SE2",

  "F1+TF1", "F1+TFF1", "F1+TBB2",
  "F2+TF2", "F2+TFF2", "F2+TBB1",

  "G1+TG1", "G1+TGG1"
];

export const CREDIT_RULES = {
  /* =====================================================
     4 CREDIT SUBJECTS
     - Theory-only: 3-slot combos (primary + two tutorials)
     - Theory + Lab: 2-slot combos (primary + one tutorial) + lab pairs
     - Lab-only: lab pairs only
  ===================================================== */
  4: {
    TH: {
      theory: FOUR_CREDIT_THEORY_TRIPLES,
      lab: []
    },
    "TH+LAB": {
      theory: FOUR_CREDIT_THEORY_PAIRS,
      lab: LAB_PAIRS
    },
    LAB: {
      theory: [],
      lab: LAB_PAIRS
    }
  },

  /* =====================================================
     3 CREDIT SUBJECTS
     (THEORY = 2 slots, LAB = paired)
  ===================================================== */
  3: {
    TH: {
      theory: [
        "A1+TA1", "A2+TA2",
        "B1+TB1", "B2+TB2",
        "C1+TC1", "C1+TCC1", "C2+TC2", "C2+TCC2",
        "D1+TD1", "D1+TDD1", "D2+TD2", "D2+TDD2",
        "E1+TE1", "E1+TEE1", "E2+TE2", "E2+TEE2",
        "F1+TF1", "F1+TFF1", "F2+TF2", "F2+TFF2",
        "G1+TG1", "G1+TGG1", "G2+TG2", "G2+TGG2"
      ],
      lab: []
    },
    "TH+LAB": {
      theory: [
        "A1+TA1", "A2+TA2",
        "B1+TB1", "B2+TB2",
        "C1+TC1", "C1+TCC1", "C2+TC2", "C2+TCC2",
        "D1+TD1", "D1+TDD1", "D2+TD2", "D2+TDD2",
        "E1+TE1", "E1+TEE1", "E2+TE2", "E2+TEE2",
        "F1+TF1", "F1+TFF1", "F2+TF2", "F2+TFF2",
        "G1+TG1", "G1+TGG1", "G2+TG2", "G2+TGG2"
      ],
      lab: LAB_PAIRS
    },
    LAB: {
      theory: [],
      lab: LAB_PAIRS
    }
  },

  /* =====================================================
     2 CREDIT SUBJECTS
     (THEORY ONLY – single slot)
  ===================================================== */
  2: {
    TH: {
      theory: [
        "A1","A2","B1","B2","C1","C2","D1","D2","E1","E2","F1","F2","G1","G2"
      ],
      lab: []
    }
  },

  /* =====================================================
     1 CREDIT SUBJECTS
     (TUTORIAL / SMALL COMPONENTS)
  ===================================================== */
  1: {
    TH: {
      theory: [
        "TA1","TA2","TB1","TB2","TC1","TC2","TD1","TD2","TE1","TE2","TF1","TF2","TG1","TG2",
        "TAA1","TAA2","TBB1","TBB2","TCC1","TCC2","TDD1","TDD2","TEE1","TEE2"
      ],
      lab: []
    }
  }
};
