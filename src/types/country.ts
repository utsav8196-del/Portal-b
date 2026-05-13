export interface Country {
  country_id: number;
  country_name: string;
  country_description: string;
  country_currency: string;
  country_status: boolean;
  show_on_homepage_status: boolean;
  is_deleted: boolean;
  country_image_names: string;
  country_flag_image_name: string;
  country_image_paths: string;
  country_flag_image_path: string;
  created_at: string;
  updated_at: string;
}

export interface PageInfo {
  total_page: number;
  pre_page: number | null;
  next_page: number | null;
  page_size: number;
  total_count: number;
  page_number: number;
}

export interface CountryListResponse {
  status_code: number;
  success: boolean;
  message: string;
  data: {
    items: Country[];
    page_info: PageInfo;
  };
}
