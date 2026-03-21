export enum ApplicationsEndpoints {
  // Admin Applications
  Admin_Get_Applications = '/admin/applications',
  Admin_Get_Application = '/admin/applications/:applicationId',
  Admin_Update_Application_Status = '/admin/applications/:applicationId/status',
  Admin_Review_Document = '/admin/applications/:applicationId/documents/:documentId/review',
}
