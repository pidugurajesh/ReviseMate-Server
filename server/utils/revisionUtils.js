const calculateSM2 = (quality, prevRepetitions, prevInterval, prevEF) => {
  let repetitions = prevRepetitions || 0;
  let interval = prevInterval || 0;
  let ef = prevEF || 2.5;

  if (quality >= 3) {
    if (repetitions === 0) {
      interval = 3; // 1st Review completed -> schedule 2nd Review: Day 7 (+3d)
    } else {
      interval = 0; // 2nd Review completed (Day 7 reached) -> cycle complete, no more reviews
    }
    repetitions++;
  } else {
    repetitions = 0;
    interval = 3; // Reset to Day 4 (+3d)
  }

  // Update Easiness Factor
  ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (ef < 1.3) ef = 1.3;

  return { repetitions, interval, easinessFactor: ef };
};

const getFirstRevisionDate = (studiedDate = new Date()) => {
  const date = new Date(studiedDate);
  date.setDate(date.getDate() + 3); // 1st Review: Day 4 (+3 days from study)
  return date;
};

module.exports = { calculateSM2, getFirstRevisionDate };
