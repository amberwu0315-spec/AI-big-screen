import { createCarbonScreenMockApi } from '@/api/carbon-screen'
import { createPolicyLibraryMockApi } from '@/api/policy-library'

export const api = {
  carbonScreen: createCarbonScreenMockApi(),
  policyLibrary: createPolicyLibraryMockApi(),
}

