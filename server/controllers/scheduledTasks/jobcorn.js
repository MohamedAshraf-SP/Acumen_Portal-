/*

get the dates of email sent

add email to bull or queue

scalued que to be processed on 12am every day

*/
import Queue from "bull";

const queue = new Queue("emailSenderQueue")

emailSenderQueue.add(
    "quartersMails",
    { email: "mohamed.ashrafsp@gmail.com" },
    { repeat: { corn: "0 0 * * *" } },
)


