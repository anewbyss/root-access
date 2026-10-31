import asyncio

async def ping(host):
    await asyncio.sleep(0)
    return f"{host}:ok"

async def sweep(hosts):
    return list(await asyncio.gather(*(ping(h) for h in hosts)))
