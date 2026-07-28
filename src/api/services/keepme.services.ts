import { expect } from '@playwright/test';
import { ApiRequest } from '../apiRequest';
import { ENV } from '../../../configs/env/env.helper';
import { fixture } from '../../commons/fixture.helper';

export class KeepmeService {
  constructor(private api: ApiRequest) {}

  async loginAndGetToken(): Promise<string> {    
    const res = await this.api.post('/api/login', {
      email: ENV.crmConfig.username,
      password: ENV.crmConfig.password,
    });    

    const contentType = res.headers()['content-type'] || '';
    const bodyText = await res.text();
    
    if (!contentType.includes('application/json')) {
      throw new Error(
        `Expected JSON but got "${contentType}". Response starts with: ${bodyText.slice(0, 120)}`
      );
    }

    const json = JSON.parse(bodyText);
    const token = json.access_token;
    
    if (!token) throw new Error('access_token missing in login response');
    return token;
  }

  async createLead(payload: any) {
    const res = await this.api.post('/leads', payload);
    expect(res.ok()).toBeTruthy();
    return res.json();
  }

  async findLead( accessToken: string)  {
    const req = await this.api.post('/api/v1/sales/leads/find', {
      fname: fixture.booking?.Firstname,
      email: fixture.booking?.email,
      venue_id: fixture.booking?.venue_id,      
    },
    { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' }
    );  
    
    const contentType = req.headers()['content-type'] || '';
    const bodyText = await req.text();
    
    if (!contentType.includes('application/json')) {
      throw new Error(
        `Expected JSON but got "${contentType}". Response starts with: ${bodyText.slice(0, 120)}`
      );
    }

    const json = JSON.parse(bodyText);
    
    const firstLead = Array.isArray(json.data) ? json.data[0] : null;
    const mem_id = firstLead.mem_id;
    const lead_status = firstLead.lead_status;     
    const tour_status = firstLead.tour_status;

    return {mem_id, lead_status, tour_status};
  }

  async findTour(accessToken: string, member_id: string)  {
    const req = await this.api.get('/api/v1/sales/tours', {
      mem_id: member_id,   
    },
    { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' }
  );  
    
    const contentType = req.headers()['content-type'] || '';
    const bodyText = await req.text();
    
    if (!contentType.includes('application/json')) {
      throw new Error(
        `Expected JSON but got "${contentType}". Response starts with: ${bodyText.slice(0, 120)}`
      );
    }

    const json = JSON.parse(bodyText);
    
    const firstLead = Array.isArray(json.data) ? json.data[0] : null;    
    const tour_status = firstLead.status;   
        
    return {tour_status};
  }

  async updateLeadStatus(leadId: string, status: string) {
    const res = await this.api.put(`/leads/${leadId}`, { status });
    expect(res.ok()).toBeTruthy();
    return res.json();
  }
}
