import JWTDecode from 'jwt-decode'
import cookieparser from 'cookieparser'
export const strict = false

export const actions = {
    nuxtServerInit({ commit, dispatch, rootState }, { req } ) {
        if(process.server && process.static )   return
        if(!req.headers.cookie) return

        const parsed = cookieparser.parse(req.headers.cookie)
        const accessTokenCookie = parsed.access_token

        if(!accessTokenCookie) return

        // console.log(accessTokenCookie, 'my token')
        const decoded = JWTDecode(accessTokenCookie)
        if(decoded) {
            commit('user/uid', decoded.user_id)
        }

    }
}