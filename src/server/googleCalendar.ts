"use server"
import { clerkClient } from "@clerk/nextjs/server";
import { google } from "googleapis"
import { startOfDay, endOfDay } from "date-fns"

export async function getCalendarEventTimes(
    clerkUserId: string,
    { start, end }: { start: Date; end: Date}
) {
    const oAuthClient = await getOAuthClient(clerkUserId)

    // get events api
    const events = await google.calendar("v3").events.list({
        calendarId: "primary",
        eventTypes: ["default"],
        singleEvents: true,
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        maxResults: 2500,
        auth: oAuthClient,
    })

    // if null return empty array
    return events.data.items?.map(event => {

        // if event has date (taking full day not specific time)
        if (event.start?.date != null && event.end?.date != null) {
            return {
                start: startOfDay(event.start.date),
                end: endOfDay(event.end.date),
            }
        }

        // if event has time
        if (event.start?.dateTime != null && event.end?.dateTime != null) {
            return {
                start: new Date(event.start.dateTime),
                end: new Date(event.end.dateTime),
            }
        }



    }).filter(date => date != null) || []
}

// get google token, return user info
async function getOAuthClient(clerkUserId: string) {
    const token = await clerkClient()
    .users
    .getUserOauthAccessToken(clerkUserId, "oauth_google")

    // return if token null
    if (token.data.length === 0 || token.data[0].token == null) {
        return
    }

    const client = new google.auth.OAuth2(
        process.env.GOOGLE_OAUTH_CLIENT_ID,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        process.env.GOOGLE_OAUTH_REDIRECT_URL,
    )

    // set credentials to access users info
    client.setCredentials({ access_token: token.data[0].token })

    return client
    
}