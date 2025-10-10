import dueDates from "../../models/company/dueDates.js";
import { companyHouse } from "../../services/thirdPartyAPI/companyhouseAPI.js";

export const getCompany = async (req, res) => {
  try {
    const company = await companyHouse("/company/" + req.params.companyNumber);
    if (!company) {
      return res.status(404).json({ message: "Company not found!!" });
    }

    const data = {
      companyName: company.company_name,
      registrationNumber: company.company_number,
      incorporationDate: company.date_of_creation,
      status: company.company_status,
      //dueDates: "-------",
      confirmationStatementDueBy: company.confirmation_statement?.next_due,
      AccountsDueBy: company.accounts.next_accounts?.due_on,
      natureOfBusiness: company.sic_codes[0],



      //addresses: "-------",
      registeredOfficeAddress: `${company?.registered_office_address.address_line_1 || ""} - ${company.registered_office_address.address_line_2 || ""} - ${company.registered_office_address.locality || ""} - ${company.registered_office_address.country || ""} - ${company.registered_office_address.postal_code || ""}`,
    };

    res.status(200).json(data);
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

    const data = companies.items.map((company) => {
      return {
        companyName: company.title,
        companyNumber: company.company_number,
      };
    });

    res.status(200).json({
      message:
        data?.length >= 1
          ? "companies fetched successfully"
          : "No companies found for your search",
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

    //console.log(officers.items[0].date_of_birth);

    // let date = new Date(officers.items[0].date_of_birth?.year, officers.items[0].date_of_birth?.month - 1, 2, 0, 0, 0)
    // //date = new Date(2000, 8, 1, 0, 0, 0)
    // console.log(date.toString());  
    // console.log(date.toLocaleString());      // Shows local time
    // console.log(date.toISOString());
    // return res.json(date);

    let data = officers.items.map((officer) => {
      return {
        dTitle: officer.officer_role,
        dName: officer.name,
        dDateOfBirth: new Date(officer.date_of_birth?.year, officer.date_of_birth?.month - 1, 2, 0, 0, 0),
        dateOfResignation: officer.appointed_on,
        address: `${officer.address?.address_line_1 || ""} - ${officer.address?.address_line_2 || ""} - ${officer.address?.locality || ""} - ${officer.address?.country || ""} - ${officer.address?.postal_code || ""}`,
      };
    })

    res.status(200).json(data);
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
