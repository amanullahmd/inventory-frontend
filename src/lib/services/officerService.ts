export type OfficerLevel = 'DPE_HQ' | 'DPEO' | 'UEO' | 'FIELD'
export type OfficerDesignation = 'Director General' | 'Director' | 'Deputy Director' | 'DPEO' | 'Assistant DPEO' | 'UEO' | 'Assistant UEO' | 'AUEO' | 'Other'

export interface Officer {
  officerId: number
  name: string
  nameBn: string
  designation: OfficerDesignation
  designationBn: string
  level: OfficerLevel
  district?: string
  districtBn?: string
  upazila?: string
  upazilaBn?: string
  officeAddress: string
  mobileNumber: string
  email?: string
  joiningDate?: string
  postingDate?: string
  bcsSession?: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

export interface CreateOfficerRequest {
  name: string
  nameBn: string
  designation: OfficerDesignation
  designationBn: string
  level: OfficerLevel
  district?: string
  districtBn?: string
  upazila?: string
  upazilaBn?: string
  officeAddress: string
  mobileNumber: string
  email?: string
  joiningDate?: string
  postingDate?: string
  bcsSession?: string
}

let mockOfficers: Officer[] = [
  // DPE_HQ (3)
  {
    officerId: 1,
    name: 'Md. Abdul Karim',
    nameBn: 'মো: আব্দুল করিম',
    designation: 'Director General',
    designationBn: 'মহাপরিচালক',
    level: 'DPE_HQ',
    officeAddress: 'প্রাথমিক শিক্ষা অধিদপ্তর, মিরপুর-২, ঢাকা-১২১৬',
    mobileNumber: '01711234567',
    email: 'dg@dpe.gov.bd',
    joiningDate: '2010-03-15',
    postingDate: '2023-01-10',
    bcsSession: '12th',
    isActive: true,
    createdAt: '2023-01-10T08:00:00Z',
    updatedAt: '2024-06-01T10:00:00Z',
  },
  {
    officerId: 2,
    name: 'Md. Rafiqul Islam',
    nameBn: 'মো: রফিকুল ইসলাম',
    designation: 'Director',
    designationBn: 'পরিচালক',
    level: 'DPE_HQ',
    officeAddress: 'প্রাথমিক শিক্ষা অধিদপ্তর, মিরপুর-২, ঢাকা-১২১৬',
    mobileNumber: '01712345678',
    email: 'director.admin@dpe.gov.bd',
    joiningDate: '2012-07-01',
    postingDate: '2023-06-15',
    bcsSession: '15th',
    isActive: true,
    createdAt: '2023-06-15T08:00:00Z',
    updatedAt: '2024-08-10T09:30:00Z',
  },
  {
    officerId: 3,
    name: 'Dr. Fatema Khanam',
    nameBn: 'ড. ফাতেমা খানম',
    designation: 'Deputy Director',
    designationBn: 'উপ-পরিচালক',
    level: 'DPE_HQ',
    officeAddress: 'প্রাথমিক শিক্ষা অধিদপ্তর, মিরপুর-২, ঢাকা-১২১৬',
    mobileNumber: '01713456789',
    email: 'dd.planning@dpe.gov.bd',
    joiningDate: '2014-01-20',
    postingDate: '2024-02-01',
    bcsSession: '20th',
    isActive: true,
    createdAt: '2024-02-01T08:00:00Z',
  },
  // DPEO (4)
  {
    officerId: 4,
    name: 'Md. Nazrul Islam',
    nameBn: 'মো: নজরুল ইসলাম',
    designation: 'DPEO',
    designationBn: 'জেলা প্রাথমিক শিক্ষা অফিসার',
    level: 'DPEO',
    district: 'Dhaka',
    districtBn: 'ঢাকা',
    officeAddress: 'জেলা প্রাথমিক শিক্ষা অফিস, ঢাকা',
    mobileNumber: '01714567890',
    email: 'dpeo.dhaka@dpe.gov.bd',
    joiningDate: '2015-06-10',
    postingDate: '2023-09-01',
    bcsSession: '25th',
    isActive: true,
    createdAt: '2023-09-01T08:00:00Z',
  },
  {
    officerId: 5,
    name: 'Md. Kamrul Hasan',
    nameBn: 'মো: কামরুল হাসান',
    designation: 'DPEO',
    designationBn: 'জেলা প্রাথমিক শিক্ষা অফিসার',
    level: 'DPEO',
    district: 'Chittagong',
    districtBn: 'চট্টগ্রাম',
    officeAddress: 'জেলা প্রাথমিক শিক্ষা অফিস, চট্টগ্রাম',
    mobileNumber: '01715678901',
    email: 'dpeo.chittagong@dpe.gov.bd',
    joiningDate: '2016-02-15',
    postingDate: '2024-01-10',
    bcsSession: '28th',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    officerId: 6,
    name: 'Md. Shahinur Rahman',
    nameBn: 'মো: শাহিনুর রহমান',
    designation: 'DPEO',
    designationBn: 'জেলা প্রাথমিক শিক্ষা অফিসার',
    level: 'DPEO',
    district: 'Rajshahi',
    districtBn: 'রাজশাহী',
    officeAddress: 'জেলা প্রাথমিক শিক্ষা অফিস, রাজশাহী',
    mobileNumber: '01716789012',
    email: 'dpeo.rajshahi@dpe.gov.bd',
    joiningDate: '2017-08-20',
    postingDate: '2024-03-15',
    bcsSession: '30th',
    isActive: true,
    createdAt: '2024-03-15T08:00:00Z',
  },
  {
    officerId: 7,
    name: 'Nahida Akter',
    nameBn: 'নাহিদা আক্তার',
    designation: 'Assistant DPEO',
    designationBn: 'সহকারী জেলা প্রাথমিক শিক্ষা অফিসার',
    level: 'DPEO',
    district: 'Khulna',
    districtBn: 'খুলনা',
    officeAddress: 'জেলা প্রাথমিক শিক্ষা অফিস, খুলনা',
    mobileNumber: '01717890123',
    email: 'adpeo.khulna@dpe.gov.bd',
    joiningDate: '2018-04-10',
    postingDate: '2024-05-20',
    bcsSession: '33rd',
    isActive: true,
    createdAt: '2024-05-20T08:00:00Z',
  },
  // UEO (5)
  {
    officerId: 8,
    name: 'Md. Saiful Islam',
    nameBn: 'মো: সাইফুল ইসলাম',
    designation: 'UEO',
    designationBn: 'উপজেলা শিক্ষা অফিসার',
    level: 'UEO',
    district: 'Dhaka',
    districtBn: 'ঢাকা',
    upazila: 'Savar',
    upazilaBn: 'সাভার',
    officeAddress: 'উপজেলা শিক্ষা অফিস, সাভার, ঢাকা',
    mobileNumber: '01718901234',
    email: 'ueo.savar@dpe.gov.bd',
    joiningDate: '2018-09-01',
    postingDate: '2024-01-05',
    bcsSession: '36th',
    isActive: true,
    createdAt: '2024-01-05T08:00:00Z',
  },
  {
    officerId: 9,
    name: 'Salma Begum',
    nameBn: 'সালমা বেগম',
    designation: 'UEO',
    designationBn: 'উপজেলা শিক্ষা অফিসার',
    level: 'UEO',
    district: 'Dhaka',
    districtBn: 'ঢাকা',
    upazila: 'Mirpur',
    upazilaBn: 'মিরপুর',
    officeAddress: 'উপজেলা শিক্ষা অফিস, মিরপুর, ঢাকা',
    mobileNumber: '01719012345',
    email: 'ueo.mirpur@dpe.gov.bd',
    joiningDate: '2019-01-15',
    postingDate: '2024-04-10',
    bcsSession: '36th',
    isActive: true,
    createdAt: '2024-04-10T08:00:00Z',
  },
  {
    officerId: 10,
    name: 'Md. Hasanuzzaman',
    nameBn: 'মো: হাসানুজ্জামান',
    designation: 'UEO',
    designationBn: 'উপজেলা শিক্ষা অফিসার',
    level: 'UEO',
    district: 'Chittagong',
    districtBn: 'চট্টগ্রাম',
    upazila: 'Patiya',
    upazilaBn: 'পটিয়া',
    officeAddress: 'উপজেলা শিক্ষা অফিস, পটিয়া, চট্টগ্রাম',
    mobileNumber: '01720123456',
    email: 'ueo.patiya@dpe.gov.bd',
    joiningDate: '2019-06-20',
    postingDate: '2024-02-15',
    bcsSession: '38th',
    isActive: true,
    createdAt: '2024-02-15T08:00:00Z',
  },
  {
    officerId: 11,
    name: 'Md. Tariqul Islam',
    nameBn: 'মো: তারিকুল ইসলাম',
    designation: 'Assistant UEO',
    designationBn: 'সহকারী উপজেলা শিক্ষা অফিসার',
    level: 'UEO',
    district: 'Rajshahi',
    districtBn: 'রাজশাহী',
    upazila: 'Paba',
    upazilaBn: 'পবা',
    officeAddress: 'উপজেলা শিক্ষা অফিস, পবা, রাজশাহী',
    mobileNumber: '01721234567',
    email: 'aueo.paba@dpe.gov.bd',
    joiningDate: '2020-03-10',
    postingDate: '2024-06-01',
    bcsSession: '38th',
    isActive: true,
    createdAt: '2024-06-01T08:00:00Z',
  },
  {
    officerId: 12,
    name: 'Sharmin Sultana',
    nameBn: 'শারমিন সুলতানা',
    designation: 'Assistant UEO',
    designationBn: 'সহকারী উপজেলা শিক্ষা অফিসার',
    level: 'UEO',
    district: 'Khulna',
    districtBn: 'খুলনা',
    upazila: 'Dumuria',
    upazilaBn: 'ডুমুরিয়া',
    officeAddress: 'উপজেলা শিক্ষা অফিস, ডুমুরিয়া, খুলনা',
    mobileNumber: '01722345678',
    email: 'aueo.dumuria@dpe.gov.bd',
    joiningDate: '2020-08-15',
    postingDate: '2024-07-10',
    bcsSession: '40th',
    isActive: false,
    createdAt: '2024-07-10T08:00:00Z',
  },
  // FIELD (3)
  {
    officerId: 13,
    name: 'Md. Anowar Hossain',
    nameBn: 'মো: আনোয়ার হোসেন',
    designation: 'AUEO',
    designationBn: 'সহকারী উপজেলা শিক্ষা অফিসার (মাঠ)',
    level: 'FIELD',
    district: 'Dhaka',
    districtBn: 'ঢাকা',
    upazila: 'Dhamrai',
    upazilaBn: 'ধামরাই',
    officeAddress: 'ক্লাস্টার রিসোর্স সেন্টার, ধামরাই, ঢাকা',
    mobileNumber: '01723456789',
    joiningDate: '2021-01-05',
    postingDate: '2024-03-20',
    bcsSession: '40th',
    isActive: true,
    createdAt: '2024-03-20T08:00:00Z',
  },
  {
    officerId: 14,
    name: 'Rashida Khatun',
    nameBn: 'রশিদা খাতুন',
    designation: 'AUEO',
    designationBn: 'সহকারী উপজেলা শিক্ষা অফিসার (মাঠ)',
    level: 'FIELD',
    district: 'Chittagong',
    districtBn: 'চট্টগ্রাম',
    upazila: 'Hathazari',
    upazilaBn: 'হাটহাজারী',
    officeAddress: 'ক্লাস্টার রিসোর্স সেন্টার, হাটহাজারী, চট্টগ্রাম',
    mobileNumber: '01724567890',
    joiningDate: '2021-06-15',
    postingDate: '2024-08-01',
    bcsSession: '42nd',
    isActive: true,
    createdAt: '2024-08-01T08:00:00Z',
  },
  {
    officerId: 15,
    name: 'Md. Jahangir Alam',
    nameBn: 'মো: জাহাঙ্গীর আলম',
    designation: 'AUEO',
    designationBn: 'সহকারী উপজেলা শিক্ষা অফিসার (মাঠ)',
    level: 'FIELD',
    district: 'Rajshahi',
    districtBn: 'রাজশাহী',
    upazila: 'Godagari',
    upazilaBn: 'গোদাগাড়ী',
    officeAddress: 'ক্লাস্টার রিসোর্স সেন্টার, গোদাগাড়ী, রাজশাহী',
    mobileNumber: '01725678901',
    joiningDate: '2022-02-10',
    postingDate: '2024-09-15',
    bcsSession: '42nd',
    isActive: false,
    createdAt: '2024-09-15T08:00:00Z',
  },
]

let nextId = 16

export class OfficerService {
  static getOfficers(): Officer[] {
    return [...mockOfficers]
  }

  static getOfficer(id: number): Officer | undefined {
    return mockOfficers.find((o) => o.officerId === id)
  }

  static createOfficer(data: CreateOfficerRequest): Officer {
    const now = new Date().toISOString()
    const officer: Officer = {
      ...data,
      officerId: nextId++,
      isActive: true,
      createdAt: now,
    }
    mockOfficers = [officer, ...mockOfficers]
    return officer
  }

  static updateOfficer(id: number, data: Partial<Officer>): Officer {
    const index = mockOfficers.findIndex((o) => o.officerId === id)
    if (index === -1) {
      throw new Error('Officer not found')
    }
    const updated: Officer = {
      ...mockOfficers[index],
      ...data,
      officerId: id,
      updatedAt: new Date().toISOString(),
    }
    mockOfficers[index] = updated
    return updated
  }

  static deleteOfficer(id: number): void {
    const index = mockOfficers.findIndex((o) => o.officerId === id)
    if (index === -1) {
      throw new Error('Officer not found')
    }
    mockOfficers.splice(index, 1)
  }

  static getOfficersByLevel(level: OfficerLevel): Officer[] {
    return mockOfficers.filter((o) => o.level === level)
  }

  static getLevelLabel(level: OfficerLevel): string {
    const labels: Record<OfficerLevel, string> = {
      DPE_HQ: 'ডিপিই সদর দপ্তর',
      DPEO: 'জেলা প্রাথমিক শিক্ষা অফিস',
      UEO: 'উপজেলা শিক্ষা অফিস',
      FIELD: 'মাঠ পর্যায়',
    }
    return labels[level]
  }

  static searchOfficers(query: string): Officer[] {
    const q = query.toLowerCase().trim()
    if (!q) return [...mockOfficers]
    return mockOfficers.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.nameBn.includes(q) ||
        o.designation.toLowerCase().includes(q) ||
        o.designationBn.includes(q) ||
        (o.district && o.district.toLowerCase().includes(q)) ||
        (o.districtBn && o.districtBn.includes(q)) ||
        (o.upazila && o.upazila.toLowerCase().includes(q)) ||
        (o.upazilaBn && o.upazilaBn.includes(q)) ||
        o.mobileNumber.includes(q)
    )
  }
}
