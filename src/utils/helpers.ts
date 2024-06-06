// Array of words that can indicate a debit or a credit, when this scales to more and more banks, the words can just be added here
const debitFlags = ["dr", "debit"];
const creditFlags = ["cr", "credit"];

// Helper function to make sure the date is in the right format.
export const formatDate = (date: string) => {
  let dateObject;
  if (date.includes("AM")) {
    date = date.replace("AM", "");
    dateObject = new Date(date);
    let formattedHour: number = dateObject.getHours();
    dateObject.setHours(formattedHour + 1);
  } else if (date.includes("PM")) {
    date = date.replace("PM", "");
    dateObject = new Date(date);
    let formattedHour: number = dateObject.getHours();
    formattedHour == 12 ? "" : (formattedHour += 12);
    dateObject.setHours(formattedHour + 1);
  } else {
    dateObject = new Date(date);
    dateObject.setHours(dateObject.getHours() + 1);
  }
  return dateObject
    .toISOString()
    .replace("T", " ")
    .replace(/\.(\S+)/g, "");
};

//Helper function to actually parse the SMS
export const parseSMS = (regex: RegExp, message: string) => {
  const match = message.match(regex);

  if (!match?.groups) {
    throw new Error("Message format not recognized.");
  }

  let res = {
    institution: match.groups?.institution,
    amount: parseFloat(match.groups?.amount || "0"),
    balance: parseFloat(match.groups?.balance || "0"),
    currency: match.groups?.currency || "Naira",
    narration: match.groups?.narration,
    transactionTime: match.groups?.transactionTime,
    debitCredit: match.groups?.debitCredit?.toLowerCase(),
  };

  debitFlags.includes(res.debitCredit) ? (res.debitCredit = "debit") : "";
  creditFlags.includes(res.debitCredit) ? (res.debitCredit = "credit") : "";

  res.transactionTime = formatDate(res.transactionTime);

  return res;
};

//Helper functions to strip all commas as they affect the regex readings, especially with digits
export const stripCommas = (value: string): string => value.replace(/,/g, "");
