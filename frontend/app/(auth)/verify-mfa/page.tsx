

import React, { Suspense } from 'react'
import VerifyMfa from './_verify-mfa';

const Page = () => {
  return (
    <Suspense>
        <VerifyMfa />
    </Suspense>
  )
}

export default Page;