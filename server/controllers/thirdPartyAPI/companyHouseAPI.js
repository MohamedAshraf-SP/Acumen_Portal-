import { companyHouse } from "../../services/thirdPartyAPI/companyhouseAPI.js";

export const getCompany = async (req, res) => {
  try {
    const company = await companyHouse("/company/" + req.params.companyNumber);
    if (!company) {
      return res.status(404).json({ message: "Company not found!!" });
    }
    res.status(200).json(company);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

export const searchCompanies = async (req, res) => {
  try {
    const companies = await companyHouse(
      "/search/companies",
      `q=${req.params.companyName}`
    );

    const data = companies?.items?.map((company) => {
      return {
        companyName: company.title,
        companyNumber: company.company_number,
      };
    });

    res.status(200).json({
      message:
        data?.length >= 1
          ? "companies fetched successfully"
          : "No companies found for your search try different name",
      data: data,
    });
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

export const getOfficers = async (req, res) => {
  try {
    const officers = await companyHouse(
      "/company/" + req.params.companyNumber + "/officers"
    );
    res.status(200).json(officers);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

// export const getFilingHistory = async (req, res) => {
//     try {
//         const filingHistory = await companyHouse("/company/" + req.params.companyNumber + "/filing-history")
//         res.status(200).json(filingHistory)
//     } catch (e) {
//         res.status(404).json({ message: e.message })
//     }
// }
