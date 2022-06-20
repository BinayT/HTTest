import React from 'react'
import { Text, RequestContext, Carousel, Button } from '@botonic/react'
import fetch from 'isomorphic-fetch'

export default class extends React.Component {
    static contextType = RequestContext

    static async botonicInit({ input, session, params, lastRoutePath }) {
        // Here we're checking if GotHouses property already exists in the Context session, and if it does, then we won't be calling the API again to fetch the same thing.

        if (session?.GotHouses === undefined) {
            const gotURL = 'https://anapioficeandfire.com/api/houses'
            const res = await fetch(gotURL, {
                url: gotURL,
                method: 'GET',
                params: { pageSize: 20 },
            })
            session.GotHouses = await res.json()
        }

        // Here we're gonna fetch it each time since it has to be a random quote, and the API responds with only one in this case.
        // First we delete random quote from the context is any exists. Then replace it with another one
        const randomChuckNorrisJoke = 'https://api.chucknorris.io/jokes/random'
        const res1 = await fetch(randomChuckNorrisJoke, {
            url: randomChuckNorrisJoke,
            method: 'GET',
            params: {}
        })
        session.randomJokes = await res1.json()

    }

    render() {
        if (this.context.lastRoutePath === null) {
            this.context.session.is_first_interaction = true
        } else {
            this.context.session.is_first_interaction = false
        }
        return (
            <>
                {
                    this.context.session.is_first_interaction ?
                        <Carousel>{this.context.session.GotHouses.map(e => <Button key={e.url}>{e.name}</Button>)}</Carousel> :
                        <Text typing='2'>{this.context.session.randomJokes.value}</Text>
                }
            </>
        )
    }
}