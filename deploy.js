/**
 * gh-pages 배포 스크립트
 * dist/ 폴더 내용만 gh-pages 브랜치에 push합니다.
 * 사용: npm run deploy
 */
import { execSync } from 'child_process'
import { mkdtempSync, cpSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

const run = (cmd) => execSync(cmd, { stdio: 'inherit' })

// 1. dist를 임시 폴더에 복사
const tmp = mkdtempSync(join(tmpdir(), 'gh-pages-'))
cpSync('dist', tmp, { recursive: true })

// 2. gh-pages 브랜치 전환 (없으면 생성)
try {
  run('git checkout gh-pages')
} catch {
  run('git checkout --orphan gh-pages')
  run('git rm -rf .')
}

// 3. 기존 파일 정리 후 dist 내용만 복사
run('git rm -rf . --ignore-unmatch -q')
cpSync(tmp, '.', { recursive: true })
rmSync(tmp, { recursive: true })

// 4. 커밋 & push
run('git add -A')
try {
  run('git commit -m "deploy: update gh-pages"')
} catch {
  console.log('No changes to deploy')
}
run('git push origin gh-pages --force')

// 5. main으로 복귀
run('git checkout main')

console.log('\n✅ Deployed to gh-pages!')
