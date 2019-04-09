import fs from 'fs-extra'
import { join } from 'path'
import os from 'os'
import { execFileSync } from 'child_process'
import { logger } from '../utils'
import { dialog } from 'electron'

export default function () {
  // Note: during runtime, we only do this for darwin.
  if (os.platform() !== 'darwin') {
    return
  }

  // Ignore during development because the paths are not the same.
  if (process.env.NODE_ENV === 'development') {
    logger.info('[ipfs on path] unavailable during development')
    return
  }

  try {
    execFileSync('ipfs')
    // 'ipfs' already exists in PATH

    // NOTE: CHECK IF NOT ASYMLINKED TO CURRENT

    const option = dialog.showMessageBox({
      type: 'info',
      message: 'IPFS on PATH',
      detail: 'You appear to have a version of the IPFS command line tools already installed. Would you like to let IPFS Desktop replace it with the latest version?',
      buttons: [
        'No',
        'Yes'
      ],
      cancelId: 0
    })

    if (option !== 1) {
      logger.info('[ipfs on path] was not added, user action')
      return
    }
  } catch (e) {
    
    // 'ipfs' gave a non-zero code or timed out => doesn't exist
  }

  try {
    fs.symlinkSync(join(__dirname, '../../../bin/ipfs.sh'), '/usr/local/bin/ipfs')
    logger.info('[ipfs on path] added to /usr/local/bin/ipfs')
  } catch (e) {
    logger.error(e)
  }
}
