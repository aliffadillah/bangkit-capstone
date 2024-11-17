export class WebResponse<T> {
  data?: T;
  errors?: string;
  message?: string; // Add a message field to provide a more descriptive response
}
