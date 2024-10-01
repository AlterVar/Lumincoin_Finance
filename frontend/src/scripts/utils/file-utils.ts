export class FileUtils {
    public static loadPageScript(src: string): Promise<void> {
        return new Promise((resolve: any, reject: any) => {
            const script: HTMLScriptElement = document.createElement('script');
            script.src = src;
            script.type = 'module';
            script.onload = (): void => resolve(('Script loaded: ' + src));
            script.onerror = (): void => reject(new Error('Script load error for: ' + src));

            document.body.appendChild(script);
        });
    }
}