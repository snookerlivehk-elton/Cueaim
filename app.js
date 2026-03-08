;(function () {
  const $ = (s, r = document) => r.querySelector(s)
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s))

  // Smooth scroll for anchor links
  $$('.links a[href^="#"], .foot-links a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1)
      const t = document.getElementById(id)
      if (t) {
        e.preventDefault()
        t.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  })

  // Toggle password eye buttons
  $$('.eye').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = $(btn.dataset.toggle)
      if (!input) return
      input.type = input.type === 'password' ? 'text' : 'password'
    })
  })

  // Open login/register from header
  $$('[data-open="login"]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault()
      $('#auth').scrollIntoView({ behavior: 'smooth' })
      $('#login-email')?.focus()
    })
  })
  $$('[data-open="register"]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault()
      $('#auth').scrollIntoView({ behavior: 'smooth' })
      $('#reg-email')?.focus()
    })
  })

  // Toast helper
  const toastEl = $('#toast')
  const toast = (msg, timeout = 2200) => {
    if (!toastEl) return
    toastEl.textContent = msg
    toastEl.classList.add('show')
    setTimeout(() => toastEl.classList.remove('show'), timeout)
  }

  // Mock verification code
  let sentCode = null
  $('#send-code')?.addEventListener('click', () => {
    sentCode = String(Math.floor(100000 + Math.random() * 900000))
    console.log('[DEMO] Verification code:', sentCode)
    toast('驗證碼已發送（展示用）')
  })

  // Local "database"
  const storageKey = 'demo-users'
  const readUsers = () => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]') } catch { return [] }
  }
  const writeUsers = (list) => localStorage.setItem(storageKey, JSON.stringify(list))

  // Register form
  $('#register-form')?.addEventListener('submit', e => {
    e.preventDefault()
    const email = $('#reg-email').value.trim().toLowerCase()
    const code = $('#reg-code').value.trim()
    const pw = $('#reg-password').value
    const pw2 = $('#reg-password2').value
    const nick = $('#reg-nickname').value.trim() || 'Player'
    const accepted = $('#reg-accept').checked
    if (!email || !pw || !pw2) return toast('請完整填寫必填欄位')
    if (pw !== pw2) return toast('兩次輸入的密碼不一致')
    if (!accepted) return toast('請同意條款後再註冊')
    if (sentCode && code !== sentCode) return toast('驗證碼不正確')
    const users = readUsers()
    if (users.find(u => u.email === email)) return toast('此電子郵件已註冊')
    users.push({ email, pw, nick })
    writeUsers(users)
    toast('註冊成功，請登入')
    $('#login-email').value = email
    $('#login-password').focus()
  })

  // Login form
  $('#login-form')?.addEventListener('submit', e => {
    e.preventDefault()
    const email = $('#login-email').value.trim().toLowerCase()
    const pw = $('#login-password').value
    const u = readUsers().find(u => u.email === email && u.pw === pw)
    if (!u) return toast('帳號或密碼錯誤')
    localStorage.setItem('demo-session', JSON.stringify({ email, nick: u.nick }))
    toast(`歡迎，${u.nick}`)
    // Update nav
    const nav = $('.links')
    if (nav) {
      nav.innerHTML = `<span style="color:#fff;opacity:.95">歡迎，${u.nick}</span>
        <a href="#pricing">收費方案</a>
        <a href="#" id="logout" class="btn btn-outline">登出</a>`
      $('#logout')?.addEventListener('click', (e) => {
        e.preventDefault()
        localStorage.removeItem('demo-session')
        location.reload()
      })
    }
  })

  // Mock checkout
  const dialog = $('#mock-checkout')
  const planName = $('#plan-name')
  $$('[data-checkout]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault()
      const plan = btn.dataset.checkout
      const zh = document.documentElement.lang && document.documentElement.lang.startsWith('zh')
      let name = ''
      if (plan === 'pass-24h') {
        name = zh ? '24 小時通行證 HKD 18' : '24h Pass HKD 18'
      } else if (plan === 'annual') {
        name = zh ? '年費 HKD 688' : 'Annual HKD 688'
      } else {
        name = zh ? '月費 HKD 88' : 'Monthly HKD 88'
      }
      planName.textContent = name
      if (typeof dialog?.showModal === 'function') {
        dialog.showModal()
      } else {
        alert('模擬付款（瀏覽器不支援 <dialog>）')
      }
    })
  })
  dialog?.addEventListener('close', () => {
    if (dialog.returnValue === 'ok') {
      toast('付款成功（展示用）')
    }
  })

  // Enable high-res PNG logo when available
  ;(() => {
    const img = new Image()
    img.onload = () => {
      document.body.classList.add('has-logo-img')
    }
    img.onerror = () => {
      document.body.classList.remove('has-logo-img')
      document.querySelectorAll('.logo-img,.splash-logo-img').forEach(el => {
        el.style.display = 'none'
      })
    }
    img.src = 'assets/logo.png'
  })()
})()

