function generateRecommendation(contract) {
  if (!contract.renewalAmount) return null;

  const marketVariation = Math.random() * 0.25 + 0.05; 
  const bestAlternative = Math.floor(
    contract.renewalAmount * (1 - marketVariation)
  );

  const potentialSavings =
    contract.renewalAmount - bestAlternative;

  const confidence =
    potentialSavings > contract.renewalAmount * 0.15
      ? "High"
      : "Medium";

  return {
    currentPrice: contract.renewalAmount,
    bestAlternative,
    potentialSavings,
    confidence,
    recommendedAction:
      potentialSavings > 0
        ? "Switch Provider"
        : "Keep Current Plan",
  };
}

module.exports = generateRecommendation;