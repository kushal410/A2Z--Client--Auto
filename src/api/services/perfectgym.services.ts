import { expect } from "@playwright/test";
import { ApiRequest } from "../apiRequest";
import { ENV } from "../../../configs/env/env.helper";
import { fixture } from "../../commons/fixture.helper";
import axios from "axios";

export class perfectgymService {
  constructor(private api: ApiRequest) {}

  async loginAndGetCookie(): Promise<string> {
    const res = await this.api.post("/Pgm/Account/Login", {
      Login: ENV.crmConfig.username,
      Password: ENV.crmConfig.password,
    });

    const contentType = res.headers()["content-type"] || "";
    const setCookieHeader = res.headers()['set-cookie'];
    const cookieValue = setCookieHeader?.split(';')[0].split('=')[1];    
    const bodyText = await res.text();

    if (!contentType.includes("application/json")) {
      throw new Error(
        `Expected JSON but got "${contentType}". Response starts with: ${bodyText.slice(0, 120)}`,
      );
    }

    const json = JSON.parse(bodyText);
    
    return cookieValue;
  }

  async createLead(payload: any) {
    const res = await this.api.post("/leads", payload);
    expect(res.ok()).toBeTruthy();
    return res.json();
  }

  async findLead( setCookie: string) {
    const body = {
      query: {
        Filtering: {
          Email: fixture.booking?.email                      
        },
        Paging: {
          PageNumber: 1,
          PageSize: 200,
        },
        Sorting: {},
      },
    };

    const rawCookie = setCookie?.trim() ?? '';
    const cookieHeader = rawCookie.startsWith('.ASPXAUTH=')
  ? rawCookie
  : `.ASPXAUTH=${rawCookie}`;

    const headers = {
      "Content-Type": "application/json",      
      "X-Client-Id": ENV.crmConfig.xclientid,
      "X-Client-Secret": ENV.crmConfig.xclientsecret,
      Cookie: cookieHeader, 
    };     
    
    const url = `${ENV.crmConfig.apibaseurl}/Pgm/Crm2/Lead/List`;
    const res = await axios.post(url, body, { headers });   

    // if (!contentType.includes("application/json")) {
    //   throw new Error(
    //     `Expected JSON but got "${contentType}". Status=${res.status()}. Response starts with: ${bodyText.slice(0, 200)}`,
    //   );
    // }

    const list = Array.isArray(res.data?.Data)
    ? res.data.Data
    : Array.isArray(res.data?.data)
      ? res.data.data
      : [];

  const firstLead = list[0];

  if (!firstLead) {
    return { lead_status: null, raw: res.data };
  }

  const lead_status =
    firstLead.lead_status ??
    firstLead.LeadStatus ??
    firstLead.Status ??
    null;

  return { lead_status, raw: res.data };
  }

  async findTour(accessToken: string, member_id: string) {
    const req = await this.api.get(
      "/api/v1/sales/tours",
      {
        mem_id: member_id,
      },
      { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
    );

    const contentType = req.headers()["content-type"] || "";
    const bodyText = await req.text();

    if (!contentType.includes("application/json")) {
      throw new Error(
        `Expected JSON but got "${contentType}". Response starts with: ${bodyText.slice(0, 120)}`,
      );
    }

    const json = JSON.parse(bodyText);
    console.log("This is the json response:", json);
    const firstLead = Array.isArray(json.data) ? json.data[0] : null;
    const tour_status = firstLead.status;

    console.log("This is the tour status:", tour_status);
    return { tour_status };
  }

  async updateLeadStatus(leadId: string, status: string) {
    const res = await this.api.put(`/leads/${leadId}`, { status });
    expect(res.ok()).toBeTruthy();
    return res.json();
  }
}
