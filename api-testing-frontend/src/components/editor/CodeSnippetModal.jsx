import React, { useState } from 'react';
import { FiX, FiCopy, FiCheck, FiCode } from 'react-icons/fi';
import toast from 'react-hot-toast';

const languages = [
  { id: 'curl', name: 'cURL' },
  { id: 'js-fetch', name: 'JavaScript (fetch)' },
  { id: 'js-axios', name: 'JavaScript (axios)' },
  { id: 'python', name: 'Python (requests)' },
  { id: 'java', name: 'Java (HttpClient)' }
];

const CodeSnippetModal = ({ isOpen, onClose, requestData }) => {
  const [activeLang, setActiveLang] = useState('curl');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !requestData) return null;

  const { method = 'GET', url = '', headers = {}, body = '' } = requestData;

  const generateSnippet = () => {
    const formattedHeaders = Object.entries(headers || {});
    
    switch (activeLang) {
      case 'curl': {
        let cmd = `curl -X ${method} "${url}"`;
        formattedHeaders.forEach(([k, v]) => {
          cmd += ` \\\n  -H "${k}: ${v}"`;
        });
        if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
          const cleanBody = typeof body === 'string' ? body : JSON.stringify(body);
          cmd += ` \\\n  -d '${cleanBody.replace(/'/g, "'\\''")}'`;
        }
        return cmd;
      }
      case 'js-fetch': {
        const headerObj = formattedHeaders.reduce((acc, [k, v]) => {
          acc[k] = v;
          return acc;
        }, {});
        
        let snippet = `fetch("${url}", {\n  method: "${method}",\n`;
        if (formattedHeaders.length) {
          snippet += `  headers: ${JSON.stringify(headerObj, null, 4)},\n`;
        }
        if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
          snippet += `  body: JSON.stringify(${typeof body === 'string' ? body : JSON.stringify(body)})\n`;
        }
        snippet += `})\n.then(response => response.json())\n.then(data => console.log(data))\n.catch(error => console.error('Error:', error));`;
        return snippet;
      }
      case 'js-axios': {
        const headerObj = formattedHeaders.reduce((acc, [k, v]) => {
          acc[k] = v;
          return acc;
        }, {});
        
        let snippet = `import axios from 'axios';\n\naxios({\n  method: '${method.toLowerCase()}',\n  url: '${url}',\n`;
        if (formattedHeaders.length) {
          snippet += `  headers: ${JSON.stringify(headerObj, null, 4)},\n`;
        }
        if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
          snippet += `  data: ${typeof body === 'string' ? body : JSON.stringify(body)}\n`;
        }
        snippet += `})\n.then(response => console.log(response.data))\n.catch(error => console.error(error));`;
        return snippet;
      }
      case 'python': {
        let snippet = `import requests\n\nurl = "${url}"\n`;
        if (formattedHeaders.length) {
          snippet += `headers = {\n` + formattedHeaders.map(([k, v]) => `    "${k}": "${v}"`).join(',\n') + `\n}\n`;
        } else {
          snippet += `headers = {}\n`;
        }
        if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
          snippet += `payload = ${typeof body === 'string' ? body : JSON.stringify(body)}\n`;
          snippet += `response = requests.${method.toLowerCase()}(url, headers=headers, data=payload)\n`;
        } else {
          snippet += `response = requests.${method.toLowerCase()}(url, headers=headers)\n`;
        }
        snippet += `print(response.status_code)\nprint(response.json())`;
        return snippet;
      }
      case 'java': {
        return `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class ApiRequest {
    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("${url}"))
                .${method}(${body && ['POST', 'PUT', 'PATCH'].includes(method) ? `HttpRequest.BodyPublishers.ofString("""\n${body}\n""")` : 'HttpRequest.BodyPublishers.noBody()'})
                ${formattedHeaders.map(([k, v]) => `.header("${k}", "${v}")`).join('\n                ')}
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println(response.statusCode());
        System.out.println(response.body());
    }
}`;
      }
      default:
        return '';
    }
  };

  const snippet = generateSnippet();

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    toast.success('Code snippet copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-dark-900 border border-dark-750 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-dark-800 flex items-center justify-between bg-dark-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <FiCode size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Generate Code Snippet</h3>
              <p className="text-xs text-dark-400">Copy pre-formatted code snippets for your preferred language</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-dark-400 hover:text-white p-1 rounded-lg hover:bg-dark-800 transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          {/* Language Selector */}
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setActiveLang(lang.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeLang === lang.id
                    ? 'bg-primary-600 text-white shadow-glow'
                    : 'bg-dark-800 text-dark-300 hover:text-white hover:bg-dark-750'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>

          {/* Snippet Output */}
          <div className="relative">
            <pre className="w-full bg-dark-950 border border-dark-750 rounded-lg p-4 font-mono text-xs text-dark-100 overflow-x-auto max-h-80 custom-scrollbar whitespace-pre">
              {snippet}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-dark-800 hover:bg-dark-700 border border-dark-700 text-white text-xs font-medium rounded-md transition-colors"
            >
              {copied ? <FiCheck size={14} className="text-emerald-400" /> : <FiCopy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeSnippetModal;
