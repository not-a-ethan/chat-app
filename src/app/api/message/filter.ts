export async function filter(content: string) {
    const filter: Array<string> = (process.env.filter)?.split(",");

    for (let i = 0; i < filter?.length; i++) {
        if (content.includes(filter[i])) {
            return false;
        }
    }

    return true;
}