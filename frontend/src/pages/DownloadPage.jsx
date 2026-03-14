import { jsPDF } from "jspdf";

const writeWrappedBlock = ({
  doc,
  text,
  x,
  y,
  maxWidth,
  pageHeight,
  topMargin,
  bottomMargin,
  lineHeight = 7,
}) => {
  const lines = doc.splitTextToSize(text, maxWidth);
  let cursorY = y;

  lines.forEach((line) => {
    if (cursorY + lineHeight > pageHeight - bottomMargin) {
      doc.addPage();
      cursorY = topMargin;
    }

    doc.text(line, x, cursorY);
    cursorY += lineHeight;
  });

  return cursorY;
};

const getScore = (test, attempt) => {
  if (!attempt?.answers) {
    return null;
  }

  const hasAnswerKey = test.questions.every((question) => typeof question.answer === "string" && question.answer);
  if (!hasAnswerKey) {
    return null;
  }

  let correct = 0;
  test.questions.forEach((q, index) => {
    if (attempt.answers[index] && attempt.answers[index] === q.answer) {
      correct += 1;
    }
  });

  return {
    correct,
    total: test.questions.length,
  };
};

export default function DownloadPage({ test, attempt, onBackToTest, onStartOver, onLogout }) {
  const score = getScore(test, attempt);
  const canStudentDownload = Boolean(test.allowStudentPdf);
  const hasAttempt = Boolean(attempt);
  const canDownload = !hasAttempt || canStudentDownload;

  const handleDownloadPdf = () => {
    if (!canDownload) {
      return;
    }

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 48;
    const topMargin = 56;
    const bottomMargin = 56;
    const contentWidth = pageWidth - marginX * 2;
    let y = topMargin;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    y = writeWrappedBlock({
      doc,
      text: "Generated MCQ Test Paper",
      x: marginX,
      y,
      maxWidth: contentWidth,
      pageHeight,
      topMargin,
      bottomMargin,
      lineHeight: 11,
    });

    y += 18;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    y = writeWrappedBlock({
      doc,
      text: `Topics: ${test.topics.join(", ")}`,
      x: marginX,
      y,
      maxWidth: contentWidth,
      pageHeight,
      topMargin,
      bottomMargin,
      lineHeight: 8,
    });
    y += 8;
    y = writeWrappedBlock({
      doc,
      text: `Difficulty: ${test.difficulty}`,
      x: marginX,
      y,
      maxWidth: contentWidth,
      pageHeight,
      topMargin,
      bottomMargin,
      lineHeight: 8,
    });
    y += 4;
    y = writeWrappedBlock({
      doc,
      text: `Total Questions: ${test.numberOfQuestions}`,
      x: marginX,
      y,
      maxWidth: contentWidth,
      pageHeight,
      topMargin,
      bottomMargin,
      lineHeight: 8,
    });
    y += 12;

    if (attempt?.studentName) {
      y = writeWrappedBlock({
        doc,
        text: `Student: ${attempt.studentName}`,
        x: marginX,
        y,
        maxWidth: contentWidth,
        pageHeight,
        topMargin,
        bottomMargin,
        lineHeight: 8,
      });
      y += 6;
    }

    if (score) {
      y = writeWrappedBlock({
        doc,
        text: `Score: ${score.correct}/${score.total}`,
        x: marginX,
        y,
        maxWidth: contentWidth,
        pageHeight,
        topMargin,
        bottomMargin,
        lineHeight: 8,
      });
      y += 6;
    }

    test.questions.forEach((mcq, index) => {
      if (y + 26 > pageHeight - bottomMargin) {
        doc.addPage();
        y = topMargin;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      y = writeWrappedBlock({
        doc,
        text: `${index + 1}. ${mcq.question}`,
        x: marginX,
        y,
        maxWidth: contentWidth,
        pageHeight,
        topMargin,
        bottomMargin,
        lineHeight: 8,
      });
      y += 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      mcq.options.forEach((option, optionIndex) => {
        const label = String.fromCharCode(65 + optionIndex);
        y = writeWrappedBlock({
          doc,
          text: `${label}. ${option}`,
          x: marginX + 16,
          y,
          maxWidth: contentWidth - 16,
          pageHeight,
          topMargin,
          bottomMargin,
          lineHeight: 7,
        });
      });

      if (attempt?.answers?.[index]) {
        y += 4;
        y = writeWrappedBlock({
          doc,
          text: `Student Answer: ${attempt.answers[index]}`,
          x: marginX + 16,
          y,
          maxWidth: contentWidth - 16,
          pageHeight,
          topMargin,
          bottomMargin,
          lineHeight: 7,
        });
      }

      if (attempt?.notes?.[index]) {
        y += 4;
        y = writeWrappedBlock({
          doc,
          text: `Student Note: ${attempt.notes[index]}`,
          x: marginX + 16,
          y,
          maxWidth: contentWidth - 16,
          pageHeight,
          topMargin,
          bottomMargin,
          lineHeight: 7,
        });
      }

      y += 10;
    });

    doc.save(`mcq-test-${test.testId}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-moss/20 bg-white/75 p-4">
        <h2 className="font-body text-lg font-semibold text-ink">Download Test Paper</h2>
        <p className="mt-2 text-sm text-moss/80">
          Download a dynamic PDF that can include student answers, notes, and scoring summary.
        </p>
        {attempt?.studentName ? <p className="mt-2 text-sm text-moss/80">Student: {attempt.studentName}</p> : null}
        {score ? (
          <p className="text-sm font-semibold text-ink">
            Score Preview: {score.correct}/{score.total}
          </p>
        ) : (
          <p className="text-sm text-moss/80">No student submission attached yet. Download will include questions only.</p>
        )}
        {hasAttempt && !canStudentDownload ? (
          <p className="mt-2 text-sm text-ember">
            Download is disabled for students. Faculty must enable student PDF access for this test.
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={!canDownload}
          className="rounded-xl bg-moss px-4 py-2 text-sm font-semibold text-sand transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          Download PDF
        </button>
        <button
          type="button"
          onClick={onBackToTest}
          className="rounded-xl border border-moss/40 px-4 py-2 text-sm text-ink transition hover:bg-moss/10"
        >
          Back to Test
        </button>
        <button
          type="button"
          onClick={onStartOver}
          className="rounded-xl border border-moss/40 px-4 py-2 text-sm text-ink transition hover:bg-moss/10"
        >
          Create Another Test
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-xl border border-moss/40 px-4 py-2 text-sm text-ink transition hover:bg-moss/10"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
