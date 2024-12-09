import OpenAI from "openai"

const chatHistory = document.getElementById('chat-history')
const chatForm = document.getElementById('chat-form')
const figureSelect = document.getElementById('historical-figure-select')
let selectedFigure = ''
let chatMessages = []

const PLACEHOLDERS = {
    THINKING: '考え中...',
    DEFAULT: 'メッセージを入力してください...'
}

const HISTORICAL_FIGURES = {
    shibusawa: {
        name: '渋沢栄一',
        greeting: '私は渋沢栄一です。日本の近代化や実業について、ご質問はありますか？',
        icon: '🏛️',
        expertise: '近代化・実業'
    },
    tsuda: {
        name: '津田梅子',
        greeting: '私は津田梅子です。女子教育や留学経験について、お話ししましょうか？',
        icon: '📚',
        expertise: '女子教育・留学'
    },
    kitasato: {
        name: '北里柴三郎',
        greeting: '私は北里柴三郎です。細菌学や免疫学について話しましょうか？',
        icon: '🔬',
        expertise: '細菌学・免疫学'
    }
}

const DEFAULT_ICON = '🤖'

figureSelect.addEventListener('change', (e) => {
    selectedFigure = e.target.value
    chatMessages = []
    if (selectedFigure) {
        chatHistory.innerHTML = `
            <div class="welcome-message">
                ${getFigureGreeting(selectedFigure)}
            </div>
        `
    }
})

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const chatInput = document.getElementById('chat-input')
    const submitButton = chatForm.querySelector('button[type="submit"]')
    const userMessage = chatInput.value.trim()
    
    if (userMessage && selectedFigure) {

        appendMessageForUser(userMessage)
        
        chatInput.placeholder = PLACEHOLDERS.THINKING
        chatInput.value = ''
        chatInput.disabled = true
        submitButton.style.display = 'none'
        
        try {
            await fetchAIResponse(userMessage)
        } catch (err) {
            console.error('Error:', err)
            appendMessageForAI(err.message)
        } finally {
            chatInput.placeholder = PLACEHOLDERS.DEFAULT
            chatInput.disabled = false
            submitButton.style.display = 'block'
        }
    }
})

function getFigureGreeting(figure) {
    return HISTORICAL_FIGURES[figure].greeting || ''
}

function appendMessageForUser(content) {
    const messageDiv = document.createElement('div')
    messageDiv.classList.add('message', 'user')
    
    const contentDiv = document.createElement('div')
    contentDiv.classList.add('message-content')
    contentDiv.textContent = content
    
    const iconDiv = document.createElement('div')
    iconDiv.classList.add('message-icon')
    iconDiv.innerHTML = '👤'
    
    messageDiv.appendChild(iconDiv)
    messageDiv.appendChild(contentDiv)
    chatHistory.appendChild(messageDiv)
    chatHistory.scrollTop = chatHistory.scrollHeight
}

function appendMessageForAI(content) {
    const messageDiv = document.createElement('div')
    messageDiv.classList.add('message', 'ai')
    
    const contentDiv = document.createElement('div')
    contentDiv.classList.add('message-content')
    contentDiv.textContent = content
    
    const iconDiv = document.createElement('div')
    iconDiv.classList.add('message-icon')
    iconDiv.innerHTML = HISTORICAL_FIGURES[selectedFigure].icon || DEFAULT_ICON
    
    messageDiv.appendChild(iconDiv)
    messageDiv.appendChild(contentDiv)
    chatHistory.appendChild(messageDiv)
    chatHistory.scrollTop = chatHistory.scrollHeight
}

async function fetchAIResponse(userMessage) {
    appendMessageForAI("こんにちは")
}

function formatErrorMessage(error) {

    // 講座用に発生させるエラーをわかりやすく返しています。
    // 参考資料：
    // https://platform.openai.com/docs/guides/error-codes
    // https://github.com/openai/openai-node

    if (error.status === 400 && error.code === 'missing_required_parameter') {
        return 'APIパラメータの設定に問題があります。messagesパラメーターの代わりにmessageになっているなど。'
    }
    else if (error.status === 400 && error.code === 'invalid_value') {
return 'APIパラメータの設定に問題があります。messagesパラメーターのroleに不正な値が指定されています。roleには "system", "assistant", "user", "function", "tool" のいずれかを指定してください。'
    }
    else if (error.status === 401 && error.code === "invalid_api_key") {
        return 'APIパラメータの設定に問題があります。APIキーを確認してください。'
    }
    else if (error.status === 404 && error.code === "model_not_found") {
        return 'APIパラメータの設定に問題があります。modelパラメーターに指定したモデルが存在しません。'
    }
    else if (error.message === "400 you must provide a model parameter") {
        return 'APIパラメータの設定に問題があります。modelパラメーターを指定してください。'
    }
    else if (error.message.includes("400 Unrecognized request argument supplied")) {
        const param = error.message.split(': ')[1];
        return `APIパラメータの設定に問題があります。不正なパラメータを削除してください: ${param}`;
    }
    return 'システムエラーが発生しました。しばらく待ってから再度お試しください。'
}
